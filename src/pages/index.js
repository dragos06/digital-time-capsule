import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CapsulesGrid from "@/components/CapsulesGrid";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import CreateButton from "@/components/CreateButton";

const timeCapsules = [
  {
    id: 1,
    title: "High School Memories",
    date: "2024-05-10",
    status: "Unlocked",
  },
  { id: 2, title: "First Web Project", date: "2030-02-15", status: "Locked" },
  {
    id: 3,
    title: "Some title",
    date: "2050-12-25",
    status: "Locked",
  },
  { id: 4, title: "College Graduation", date: "2028-06-30", status: "Locked" },
  {
    id: 5,
    title: "First Car Purchase",
    date: "2032-04-18",
    status: "Unlocked",
  },
  { id: 6, title: "Bucket List Goals", date: "2035-07-20", status: "Locked" },
  { id: 7, title: "Trip to Japan", date: "2031-11-05", status: "Locked" },
  { id: 8, title: "Dream House Plans", date: "2040-09-15", status: "Unlocked" },
  { id: 9, title: "My First Business", date: "2033-03-22", status: "Locked" },
  {
    id: 10,
    title: "Wedding Anniversary",
    date: "2038-12-01",
    status: "Unlocked",
  },
  {
    id: 11,
    title: "Message to Future Me",
    date: "2045-01-10",
    status: "Locked",
  },
  {
    id: 12,
    title: "Best Friends Memories",
    date: "2029-08-05",
    status: "Unlocked",
  },
  {
    id: 13,
    title: "Life Lessons Compilation",
    date: "2036-06-12",
    status: "Locked",
  },
  { id: 14, title: "Hobby Evolution", date: "2034-02-28", status: "Unlocked" },
  {
    id: 15,
    title: "Family Photos Archive",
    date: "2042-10-10",
    status: "Locked",
  },
  {
    id: 16,
    title: "First Day at Work",
    date: "2030-09-01",
    status: "Unlocked",
  },
  {
    id: 17,
    title: "Gaming Achievements",
    date: "2037-05-20",
    status: "Locked",
  },
  {
    id: 18,
    title: "Favorite Songs Playlist",
    date: "2039-03-25",
    status: "Unlocked",
  },
  {
    id: 19,
    title: "My Childhood Stories",
    date: "2041-07-08",
    status: "Locked",
  },
  { id: 20, title: "Secret Message", date: "2055-12-31", status: "Locked" },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 9;

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredCapsules = timeCapsules.filter((capsule) =>
    capsule.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //calculate total number of pages
  const totalPages = Math.ceil(filteredCapsules.length / itemsPerPage);

  //calculate index of last item
  const indexOfLastItem = currentPage * itemsPerPage;

  //calculate index of first item
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //find capsules for current page
  const currentCapsules = filteredCapsules.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div class="min-h-screen bg-gray-100 font-courier">
      <Header />

      <SearchBar onSearch={handleSearch} />

      <CapsulesGrid capsules={currentCapsules} />

      <div class="fixed bottom-3 left-3 right-3 flex justify-between">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        <CreateButton />
      </div>
    </div>
  );
}
