import { useState } from "react";

export default function SearchBar({
  onSearch,
  onSort,
  sortOrder,
  onFilter,
  filterCase,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
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
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg mx-2 border-2"
      />

      {/* Sort Button */}
      <button
        onClick={onSort}
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg mx-2 border-2"
      >
        Sort {sortOrder === "asc" ? "▲" : "▼"}
      </button>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        aria-label="filterButton"
        className="px-4 py-2 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg border-2"
      >
        Show: {filterCase}
      </button>
    </div>
  );
}
