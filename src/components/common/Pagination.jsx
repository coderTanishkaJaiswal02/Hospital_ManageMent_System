import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
 const generatePageNumbers = () => {
  const pages = [];

  // Always show first page
  if (currentPage > 2) {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
  }

  // Show current page and one before/after
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    pages.push(i);
  }

  // Always show last page
  if (currentPage < totalPages - 1) {
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};


  const pages = generatePageNumbers();

  return (
    <div className="flex justify-center items-center md:gap-2 md:mt-6 mt-8">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-black hover:bg-blue-600  hover:text-white rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((p, index) =>
        p === "..." ? (
          <span key={index} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded ${
              currentPage === p
                ? " bg-blue-500 text-white"
                : " text-black hover:bg-blue-600 hover:text-white"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-black hover:bg-blue-600 hover:text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
