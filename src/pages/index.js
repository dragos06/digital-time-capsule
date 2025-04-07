import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import CapsulesGrid from "@/components/Capsule/CapsulesGrid";
import Pagination from "@/components/UI/Pagination";
import SearchBar from "@/components/UI/SearchBar";
import CreateButton from "@/components/UI/CreateButton";
import { enqueueOfflineData, syncOfflineQueue } from "@/utils/offlineQueue";

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

  const [isOnline, setIsOnline] = useState(null);
  const [isServerReachable, setIsServerReachable] = useState(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      checkServerStatus();
    }, 500);

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
        { method: "GET" }
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
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (bottom && hasMore) {
        fetchCapsules();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, offset, searchTerm, sortOrder, filterCase]);

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

    setTimeCapsules((prev) => prev.filter((capsule) => capsule.id !== id));

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
