import { useState } from "react";
import Header from "@/components/Header";
import CapsulesGrid from "@/components/CapsulesGrid";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import CreateButton from "@/components/CreateButton";
import { useEffect } from "react";
import initialTimeCapsules from "@/data/Capsules";

export default function Home() {
  const [timeCapsules, setTimeCapsules] = useState(initialTimeCapsules);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCase, setFilterCase] = useState("All");

  const itemsPerPage = 9;

  const syncInitialTimeCapsules = (newCapsules) => {
    initialTimeCapsules.length = 0; // Clear the original data
    initialTimeCapsules.push(...newCapsules); // Add the updated data
  };

  useEffect(() => {
    const currentDate = new Date();
    const updatedCapsules = timeCapsules.map((capsule) => {
      if (new Date(capsule.date) < currentDate && capsule.status === "Locked") {
        return { ...capsule, status: "Unlocked" };
      }
      return capsule;
    });
    setTimeCapsules(updatedCapsules);
    syncInitialTimeCapsules(updatedCapsules);
    // Sync changes to initialTimeCapsules
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      setTimeCapsules((prevCapsules) =>
        [...prevCapsules].sort((a, b) =>
          newOrder === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        )
      );
      return newOrder;
    });
  };

  const handleFilter = () => {
    setFilterCase((prevFilter) => {
      const newFilter =
        prevFilter === "Unlocked" ? "Locked" :
        prevFilter === "Locked" ? "All" : "Unlocked";

      const filteredCapsules = newFilter === "All"
        ? initialTimeCapsules
        : initialTimeCapsules.filter((capsule) => capsule.status === newFilter);

      setTimeCapsules(filteredCapsules);
      return newFilter;
    });
  };

  const handleDeleteCapsule = (id) => {
    const updatedCapsules = timeCapsules.filter((capsule) => capsule.id !== id);
    setTimeCapsules(updatedCapsules);
    syncInitialTimeCapsules(updatedCapsules); // Sync after deleting
  };

  const handleAddCapsule = (title, date, description) => {
    if (!title.trim() || !date.trim() || !description.trim()) return;

    const newCapsule = {
      id: initialTimeCapsules.length + 1, // Ensure unique IDs
      title,
      date,
      description,
      status: "Locked",
    };

    const updatedCapsules = [...timeCapsules, newCapsule];
    setTimeCapsules(updatedCapsules);
    syncInitialTimeCapsules(updatedCapsules); // Sync after adding
  };

  const filteredCapsules = timeCapsules.filter((capsule) =>
    capsule.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCapsules.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCapsules = filteredCapsules.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="min-h-screen bg-gray-100 font-courier">
      <Header />

      <SearchBar
        onSearch={handleSearch}
        onSort={handleSort}
        sortOrder={sortOrder}
        onFilter={handleFilter}
        filterCase={filterCase}
      />

      <CapsulesGrid capsules={currentCapsules} onDelete={handleDeleteCapsule} />

      <div className="fixed bottom-3 left-3 right-3 flex justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        <CreateButton onAdd={handleAddCapsule} />
      </div>
    </div>
  );
}
