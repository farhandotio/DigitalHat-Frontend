import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, total, limit, onPageChange, onLimitChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const makePages = () => {
    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);
    for (let i = page - 1; i <= page + 1; i++)
      if (i >= 1 && i <= totalPages) pages.add(i);
    return Array.from(pages).sort((a, b) => a - b);
  };

  const pages = makePages();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border text-text border-border rounded hover:bg-secondary-bg disabled:opacity-50 flex items-center gap-1"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {showEllipsis && <span className="px-2">...</span>}
              <button
                className={`px-3 py-1 border border-border rounded ${
                  p === page
                    ? " bg-primary hover:scale-103  text-white"
                    : "hover:bg-secondary-bg"
                }`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}

        <button
          className="px-3 py-1 border border-border rounded text-text hover:bg-secondary-bg flex items-center gap-1 disabled:opacity-50"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Limit selector */}
      <div className="flex items-center text-text gap-2">
        <span className="text-sm">Items per page:</span>
        <select
          className="border border-border rounded px-2 py-1"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={40}>40</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
