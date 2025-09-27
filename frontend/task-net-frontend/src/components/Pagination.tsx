import React from "react";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

const Pagination: React.FC<Props> = ({ page, setPage, totalPages }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination flex items-center justify-center gap-2">
      <button
        className="btn ghost small"
        onClick={() => setPage(1)}
        disabled={page === 1}
      >
        «
      </button>
      <button
        className="btn ghost small"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ‹
      </button>

      <div className="flex items-center gap-1 whitespace-nowrap">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`small px-3 py-1 rounded ${p === page ? "btn" : "btn ghost"}`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="btn ghost small"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        ›
      </button>
      <button
        className="btn ghost small"
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;