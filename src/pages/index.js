import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import CapsulesGrid from "@/components/Capsule/CapsulesGrid";
import Pagination from "@/components/UI/Pagination";
import SearchBar from "@/components/UI/SearchBar";
import CreateButton from "@/components/UI/CreateButton";
import { enqueueOfflineData, syncOfflineQueue } from "@/utils/offlineQueue";
import { io } from "socket.io-client";
import PieChart from "@/components/UI/PieChart";
import axios from "axios";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  transports: ["websocket"],
});

export default function Home() {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCase, setFilterCase] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;
  const [capsuleStats, setCapsuleStats] = useState({ locked: 0, unlocked: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const [isOnline, setIsOnline] = useState(null);
  const [isServerReachable, setIsServerReachable] = useState(null);

  useEffect(() => {
    socket.on("capsuleStats", (updatedStats) => {
      setCapsuleStats(updatedStats);
    });

    return () => {
      socket.off("capsuleStats");
    };
  }, []);

  const handleGenerate = async () => {
    if (isGenerating) {
      // Stop generating capsules if already generating
      clearInterval(intervalId);
      setIsGenerating(false);
      setIntervalId(null);
    } else {
      // Start generating capsules every 2 seconds
      const id = setInterval(async () => {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules/generate`,
          {
            count: 1,
          }
        );
      }, 2000);

      setIntervalId(id);
      setIsGenerating(true);
    }
  };

  useEffect(() => {
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
  }, [isOnline, isServerReachable]);

  const checkServerStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules`,
        { method: "GET", headers: { "X-Health-Check": "true" } }
      );
      if (!res.ok) throw new Error("Failed to reach server");
      setIsServerReachable(res.ok);
    } catch (error) {
      setIsServerReachable(false);
      console.warn("Server unreachable:", error.message);
    }
  };

  useEffect(() => {
    setOffset(0);
    fetchCapsules(true);
  }, [searchTerm, sortOrder, filterCase]);

  const fetchCapsules = async (reset = false) => {
    try {
      let url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/capsules?search=${searchTerm}&sort=${sortOrder}&status=${filterCase}&offset=${
        reset ? 0 : offset
      }&limit=${limit}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch capsules");

      const { capsules, hasMore } = await response.json();
      console.log("Fetched capsules:", capsules, "Has more:", hasMore);
      setHasMore(hasMore);
      setTimeCapsules((prev) => (reset ? capsules : [...prev, ...capsules]));
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

      // Check if the user is close to the bottom and if there are more capsules to load
      if (bottom && hasMore) {
        fetchCapsules();
      }
    };

    // Debounced scroll handling to prevent multiple rapid calls
    const debounceHandleScroll = debounce(handleScroll, 300);

    window.addEventListener("scroll", debounceHandleScroll);
    return () => window.removeEventListener("scroll", debounceHandleScroll);
  }, [hasMore, offset, searchTerm, sortOrder, filterCase]);

  // Utility function to create a debounce effect
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

    setTimeCapsules((prev) => prev.filter((capsule) => capsule.capsule_id !== id));

    if (!isOnline || !isServerReachable) {
      enqueueOfflineData({ type: "DELETE", data: deletePayload });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules/${id}`,
        {
          method: "DELETE",
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capsules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // const totalPages = Math.ceil(timeCapsules.length / itemsPerPage);
  // const currentCapsules = timeCapsules.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  useEffect(() => {
    if (isOnline && isServerReachable) {
      syncOfflineQueue(process.env.NEXT_PUBLIC_API_BASE_URL);
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

      <SearchBar
        onSearch={setSearchTerm}
        onSort={handleSortAction}
        sortOrder={sortOrder}
        onFilter={handleFilterAction}
        filterCase={filterCase}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <div className="flex justify-center py-5">
        <PieChart stats={capsuleStats} />
        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isGenerating ? "Stop Generating" : "Generate Random Capsules"}
        </button>
      </div>

      <CapsulesGrid capsules={timeCapsules} onDelete={handleDeleteAction} />

      <div className="fixed bottom-3 left-3 right-3 flex justify-between">
        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        /> */}

        <CreateButton onAdd={handleAddAction} />
      </div>
    </div>
  );
}
