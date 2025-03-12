export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div class="fixed bottom-2 left-2 justify-center items-center mt-6 space-x-4">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        class={
          "px-4 py-2 font-bold text-black rounded-lg " +
          (currentPage === 1 ? "text-gray-500" : "cursor-pointer  text-black")
        }
      >
        {"<--"} Previous
      </button>

      {/* Page Counter */}
      <span class="text-lg font-semibold text-black">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        class={
          "px-4 py-2 font-bold text-black rounded-lg " +
          (currentPage === totalPages ? "text-gray-500" : "cursor-pointer  text-black")
        }
      >
        Next {"-->"}
      </button>
    </div>
  );
}
