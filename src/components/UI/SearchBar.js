import { useState } from "react";

export default function SearchBar({ onSearch, onSort, sortOrder, onFilter, filterCase, onItemsPerPageChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleItemsPerPageChange = (event) => {
    onItemsPerPageChange(parseInt(event.target.value)); // Pass selected value to parent
  };

  return (
    <div className="flex justify-end px-5 py-4">
      {/* Search Input */}
      <input
        type="text"
        aria-label="searchInput"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search capsules..."
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg mx-2"
      />

      {/* Sort Button */}
      <button
        onClick={onSort}
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg mx-2"
      >
        Sort {sortOrder === "asc" ? "▲" : "▼"}
      </button>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        aria-label="filterButton"
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg"
      >
        Show: {filterCase}
      </button>

      {/* <select
        onChange={handleItemsPerPageChange}
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg mx-2"
      >
        <option value={9}>9</option>
        <option value={15}>15</option>
        <option value={30}>30</option>
      </select> */}
    </div>
  );
}
