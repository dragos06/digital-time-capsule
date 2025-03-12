export default function Pagination({currentPage, totalPages, setCurrentPage}){
    return(
        <div class="fixed bottom-4 left-4 justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          class={
            'px-4 py-2 font-bold text-black ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"} rounded-lg'
          }
        >
          ← Previous
        </button>

        <span class="text-lg font-semibold text-black">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          class={
            'px-4 py-2 font-bold text-black ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"} rounded-lg'
          }
        >
          Next →
        </button>
      </div>
    );
}