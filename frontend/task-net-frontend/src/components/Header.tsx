import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
        </div>
        <div>
          <h1 className="text-2xl font-bold">TaskNet</h1>
          <p className="text-sm text-muted">
            Quản lý nhiệm vụ — nhanh, gọn, trực quan
          </p>
        </div>
      </div>

      {/* <div>
        <a
          className="btn small"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          New Project
        </a>
      </div> */}
    </header>
  );
};

export default Header;