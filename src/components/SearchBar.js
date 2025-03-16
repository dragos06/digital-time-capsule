import { useState } from "react";

export default function SearchBar({onSearch}) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div class="flex justify-end px-5 py-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search capsules..."
        class="px-4 bg-[#D9D9D9] rounded-4xl text-black drop-shadow-lg"
      />
    </div>
  );
}
