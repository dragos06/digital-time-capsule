import { useState, useEffect } from "react";
import Header from "@/components/UI/Header";
import CapsulesGrid from "@/components/Capsule/CapsulesGrid";
import Pagination from "@/components/UI/Pagination";
import SearchBar from "@/components/UI/SearchBar";
import CreateButton from "@/components/UI/CreateButton";

export default function Home() {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCase, setFilterCase] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(9);

  useEffect(() => {
    fetchCapsules();
  }, [searchTerm, sortOrder, filterCase]);

  const fetchCapsules = async () => {
    try {
      let url = `http://localhost:5000/capsules?search=${searchTerm}&sort=${sortOrder}&status=${filterCase}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch capsules");

      const data = await response.json();
      setTimeCapsules(data);
    } catch (error) {
      console.error("Error fetching capsules:", error);
    }
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
    try {
      const response = await fetch(`http://localhost:5000/capsules/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete capsule");

      setTimeCapsules((prev) => prev.filter((capsule) => capsule.id !== id));
    } catch (error) {
      console.error("Error deleting capsule:", error);
    }
  };

  const handleAddAction = async (title, date, description) => {
    try {
      const response = await fetch("http://localhost:5000/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, description, status: "Locked" }),
      });

      if (!response.ok) throw new Error("Failed to add capsule");

      const createdCapsule = await response.json();

      fetchCapsules();

      return createdCapsule;
    } catch (error) {
      console.error("Error adding capsule:", error);
      return null;
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(timeCapsules.length / itemsPerPage);
  const currentCapsules = timeCapsules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 font-courier pb-10">
      <Header />

      <SearchBar
        onSearch={setSearchTerm}
        onSort={handleSortAction}
        sortOrder={sortOrder}
        onFilter={handleFilterAction}
        filterCase={filterCase}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <CapsulesGrid capsules={currentCapsules} onDelete={handleDeleteAction} />

      <div className="fixed bottom-3 left-3 right-3 flex justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        <CreateButton onAdd={handleAddAction} />
      </div>
    </div>
  );
}
