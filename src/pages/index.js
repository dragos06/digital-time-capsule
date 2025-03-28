import { useState, useEffect, useMemo } from "react";
import Header from "@/components/UI/Header";
import CapsulesGrid from "@/components/Capsule/CapsulesGrid";
import Pagination from "@/components/UI/Pagination";
import SearchBar from "@/components/UI/SearchBar";
import CreateButton from "@/components/UI/CreateButton";
import initialTimeCapsules from "@/data/Capsules";
import { handleAddCapsule } from "@/utils/handleAddCapsule";
import { handleDeleteCapsule } from "@/utils/handleDeleteCapsule";
import { handleFilter } from "@/utils/handleFilter";
import { handleSort } from "@/utils/handleSort";
import { updateCapsulesStatus } from "@/utils/updateCapsulesStatus";
import CapsulesChart from "@/components/UI/CapsuleChart";
import { faker } from "@faker-js/faker";

export default function Home() {
  const [timeCapsules, setTimeCapsules] = useState(initialTimeCapsules);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCase, setFilterCase] = useState("All");
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isAddingCapsules, setIsAddingCapsules] = useState(false); // Track whether the thread is running
  const [intervalId, setIntervalId] = useState(null); // Store the interval ID

  // const chartData = useMemo(() => {
  //   const unlockedCount = timeCapsules.filter(
  //     (capsule) => capsule.status === "Unlocked"
  //   ).length;
  //   const lockedCount = timeCapsules.filter(
  //     (capsule) => capsule.status === "Locked"
  //   ).length;

  //   return {
  //     labels: ["Unlocked", "Locked"],
  //     datasets: [
  //       {
  //         label: "Capsules",
  //         data: [unlockedCount, lockedCount],
  //         backgroundColor: ["#4caf50", "#f44336"],
  //       },
  //     ],
  //   };
  // }, [timeCapsules]);

  // useEffect(() => {
  //   let id;
  //   if (isAddingCapsules) {
  //     id = setInterval(() => {
  //       const newCapsule = {
  //         title: faker.lorem.words(3),
  //         description: faker.lorem.paragraph(),
  //         date: faker.date.recent(30).toISOString().split("T")[0],
  //         status: "Locked"
  //       };

  //       // Update timeCapsules state, this will automatically trigger chartData recalculation
  //       setTimeCapsules((prevCapsules) => {
  //         const updatedCapsules = [...prevCapsules, newCapsule];
  //         handleSort(updatedCapsules, setTimeCapsules, sortOrder);
  //         return updatedCapsules;
  //       });
  //     }, 1000); // Adds a capsule every second

  //     setIntervalId(id);
  //   } else if (intervalId) {
  //     clearInterval(intervalId);
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [isAddingCapsules, sortOrder]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortAction = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      handleSort(timeCapsules, setTimeCapsules, newOrder);
      return newOrder;
    });
  };

  const handleFilterAction = () => {
    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);
  };

  const handleDeleteAction = (id) => {
    handleDeleteCapsule(id, timeCapsules, setTimeCapsules, initialTimeCapsules);
  };

  const handleAddAction = (title, date, description) => {
    handleAddCapsule(
      title,
      date,
      description,
      timeCapsules,
      setTimeCapsules,
      initialTimeCapsules
    );
    handleSort(timeCapsules, setTimeCapsules, sortOrder);
    //updateChartData()
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
    <div className="min-h-screen bg-gray-100 font-courier pb-10">
      <Header />

      <SearchBar
        onSearch={handleSearch}
        onSort={handleSortAction}
        sortOrder={sortOrder}
        onFilter={handleFilterAction}
        filterCase={filterCase}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* <CapsulesChart chartData={chartData}/> */}

      <CapsulesGrid capsules={currentCapsules} onDelete={handleDeleteAction} />

      <div className="fixed bottom-3 left-3 right-3 flex justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        {/* <div>
          <button
            onClick={() => setIsAddingCapsules((prev) => !prev)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {isAddingCapsules ? "Stop Adding" : "Start Adding Capsules"}
          </button>
        </div> */}

        <CreateButton onAdd={handleAddAction} />
      </div>
    </div>
  );
}
