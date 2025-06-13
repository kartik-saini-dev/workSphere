import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ totalPages, onPageChange, currentPage }) => {
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const visiblePages = range(
    Math.max(1, currentPage - 2),
    Math.min(totalPages, currentPage + 2)
  );

  const showEllipsesStart = currentPage > 3;
  const showEllipsesEnd = currentPage < totalPages - 2;

  return (
    <div className="flex items-center justify-center mt-8 space-x-2">
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>

      {showEllipsesStart && (
        <>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 shadow hover:bg-gray-300 transition-all"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          <span className="text-gray-400 px-2">...</span>
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded-full shadow transition-all ${
            page === currentPage
              ? 'bg-indigo-500 text-white scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showEllipsesEnd && (
        <>
          <span className="text-gray-400 px-2">...</span>
          <button
            className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 shadow hover:bg-gray-300 transition-all"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:scale-105'
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
