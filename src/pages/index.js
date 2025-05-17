import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import CapsulesGrid from "@/components/Capsule/CapsulesGrid";
import SearchBar from "@/components/UI/SearchBar";
import CreateButton from "@/components/UI/CreateButton";
import { enqueueOfflineData, syncOfflineQueue } from "@/utils/offlineQueue";
import { io } from "socket.io-client";
import axios from "axios";
import LoginForm from "@/components/UI/LoginForm";
import RegisterForm from "@/components/UI/RegisterForm";
import MonitoredUsers from "@/components/UI/adminPage";

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  transports: ["websocket"],
});

export default function Home() {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCase, setFilterCase] = useState("All");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;
  const [capsuleStats, setCapsuleStats] = useState({ locked: 0, unlocked: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [isServerReachable, setIsServerReachable] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIfAdmin = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/admin-data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setIsAdmin(true);
        console.log("✅ User is admin");
      } else {
        setIsAdmin(false);
        console.log("❌ User is NOT admin");
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
    }
  };

  const handleLogin = async (status) => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoggedIn(status);
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      setOffset(0);
      fetchCapsules(true);
      checkIfAdmin();
    }
  }, [isLoggedIn, token, searchTerm, sortOrder, filterCase]);

  useEffect(() => {
    socket.on("capsuleStats", (updatedStats) => {
      setCapsuleStats(updatedStats);
    });

    return () => {
      socket.off("capsuleStats");
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      checkServerStatus();
    }, 5000);

    console.log({ isOnline, isServerReachable });
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, isServerReachable, token]);

  const checkServerStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/capsules`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Health-Check": "true",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to reach server");
      setIsServerReachable(res.ok);
    } catch (error) {
      setIsServerReachable(false);
      console.warn("Server unreachable:", error.message);
    }
  };

  const fetchCapsules = async (reset = false) => {
    try {
      let url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/capsules?search=${searchTerm}&sort=${sortOrder}&status=${filterCase}&offset=${
        reset ? 0 : offset
      }&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch capsules");

      const { capsules, hasMore } = await response.json();
      console.log("Fetched capsules:", capsules, "Has more:", hasMore);
      setHasMore(hasMore);
      setTimeCapsules((prev) => {
        const merged = reset ? capsules : [...prev, ...capsules];
        const uniqueCapsules = Array.from(
          new Map(merged.map((c) => [c.capsule_id, c])).values()
        );
        return uniqueCapsules;
      });
      setOffset((prev) => (reset ? limit : prev + limit));
    } catch (error) {
      setIsServerReachable(false);
      console.warn("Error fetching capsules:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottom && hasMore) {
        fetchCapsules();
      }
    };

    const debounceHandleScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debounceHandleScroll);
    return () => window.removeEventListener("scroll", debounceHandleScroll);
  }, [hasMore, offset, searchTerm, sortOrder, filterCase]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSortAction = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleFilterAction = () => {
    setFilterCase((prevStatus) =>
      prevStatus === "All"
        ? "Locked"
        : prevStatus === "Locked"
        ? "Unlocked"
        : "All"
    );
  };

  const handleDeleteAction = async (id) => {
    const deletePayload = { id };

    setTimeCapsules((prev) =>
      prev.filter((capsule) => capsule.capsule_id !== id)
    );

    if (!isOnline || !isServerReachable) {
      enqueueOfflineData({ type: "DELETE", data: deletePayload });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/capsules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete capsule");
      fetchCapsules();
    } catch (error) {
      console.error("Error deleting capsule:", error);
      enqueueOfflineData({ type: "DELETE", data: deletePayload });
    }
  };

  const handleAddAction = async (title, date, description) => {
    const payload = { title, date, description, status: "Locked" };

    if (!isOnline || !isServerReachable) {
      enqueueOfflineData({ type: "CREATE", data: payload });
      setTimeCapsules((prev) => [...prev, payload]);
      return payload;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/capsules`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to add capsule");

      const createdCapsule = await response.json();

      fetchCapsules();
      return createdCapsule;
    } catch (error) {
      console.error("Error adding capsule:", error);
      enqueueOfflineData({ type: "CREATE", data: payload });
      setTimeCapsules((prev) => [...prev, payload]);
      return payload;
    }
  };

  useEffect(() => {
    if (isOnline && isServerReachable) {
      syncOfflineQueue(process.env.NEXT_PUBLIC_API_URL);
    }
  }, [isOnline, isServerReachable]);

  return (
    <div className="min-h-screen bg-gray-100 font-courier pb-10">
      {isOnline === false && (
        <div className="bg-yellow-300 text-center py-2 rounded mb-2">
          ⚠️ You are offline. Changes will sync when online.
        </div>
      )}

      {isOnline && isServerReachable === false && (
        <div className="bg-red-300 text-center py-2 rounded mb-2">
          ⚠️ Server is unreachable. Saving to offline queue.
        </div>
      )}

      <Header />

      {!isLoggedIn ? (
        <div>
          {justRegistered && (
            <div className="bg-green-200 text-green-800 p-2 rounded mb-4 text-center">
              ✅ Registration successful! Please log in.
            </div>
          )}
          <LoginForm onLogin={handleLogin} />
          <RegisterForm onRegister={() => setJustRegistered(true)} />
        </div>
      ) : (
        <div>
          {isAdmin ? (
            <MonitoredUsers />
          ) : (
            <div>
              <SearchBar
                onSearch={setSearchTerm}
                onSort={handleSortAction}
                sortOrder={sortOrder}
                onFilter={handleFilterAction}
                filterCase={filterCase}
              />
              <CapsulesGrid
                capsules={timeCapsules}
                onDelete={handleDeleteAction}
              />

              <div className="fixed bottom-3 left-3 right-3 flex justify-end">
                <CreateButton onAdd={handleAddAction} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
