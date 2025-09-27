import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import StatsPanel from "./components/StatsPanel";
import Pagination from "./components/Pagination";
import useTasks from "./hooks/useTasks";
import { Task } from "./types"; // nếu có shared type

export default function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    editTask,
    filter,
    setFilter,
    paginatedTasks,
    completedCount,
    pendingCount,
    page,
    setPage,
    totalPages,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    clearDateFilter,
  } = useTasks();

  // editing state to open TaskForm for update (modal)
  const [editing, setEditing] = useState<Task | null>(null);

  function openEdit(task: Task) {
    setEditing(task);
  }

  async function handleSave(updated: Task) {
    await editTask(updated);
    setEditing(null);
  }

  // close modal on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setEditing(null);
    }
    if (editing) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [editing]);

  // show stats inline in the aside (no popup)
  const [showStats, setShowStats] = useState(false);

  // local temp fields for date inputs (user edits, then clicks "Lọc")
  const [tempFrom, setTempFrom] = useState<string>(dateFrom ?? "");
  const [tempTo, setTempTo] = useState<string>(dateTo ?? "");

  // keep temp inputs in sync when external date filters change
  useEffect(() => {
    setTempFrom(dateFrom ?? "");
    setTempTo(dateTo ?? "");
  }, [dateFrom, dateTo]);

  function applyDateFilter() {
    setDateFrom(tempFrom || null);
    setDateTo(tempTo || null);
    setPage(1);
  }

  function setToday() {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    setTempFrom(iso);
    setTempTo(iso);
    // apply immediately for convenience
    setDateFrom(iso);
    setDateTo(iso);
    setPage(1);
  }

  function setNext7Days() {
    const d = new Date();
    const from = d.toISOString().slice(0, 10);
    const toDateObj = new Date();
    toDateObj.setDate(d.getDate() + 6);
    const to = toDateObj.toISOString().slice(0, 10);
    setTempFrom(from);
    setTempTo(to);
    setDateFrom(from);
    setDateTo(to);
    setPage(1);
  }

  return (
    <div className="app-root min-h-screen py-10">
      <div className="container mx-auto px-4">
        <Header />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Task list */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Filters & date controls (unchanged) */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  {(["all", "pending", "in-progress", "completed"] as const).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setPage(1);
                        }}
                        className={`small px-3 py-1 rounded ${
                          filter === f ? "btn" : "btn ghost"
                        }`}
                      >
                        {f === "all" ? "Tất cả" : f}
                      </button>
                    )
                  )}
                </div>

                {/* compact date filter + actions below filters */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={tempFrom}
                      onChange={(e) => setTempFrom(e.target.value)}
                      className="small-input"
                      title="Từ ngày"
                    />
                    <input
                      type="date"
                      value={tempTo}
                      onChange={(e) => setTempTo(e.target.value)}
                      className="small-input"
                      title="Đến ngày"
                    />
                    <button
                      className="btn ghost small"
                      onClick={applyDateFilter}
                      title="Lọc theo ngày"
                    >
                      Lọc
                    </button>
                    <button
                      className="btn ghost small"
                      onClick={() => {
                        setTempFrom("");
                        setTempTo("");
                        clearDateFilter();
                        setPage(1);
                      }}
                      title="Xóa bộ lọc ngày"
                    >
                      Xóa
                    </button>

                    {/* move these buttons into the same row */}
                    <button className="btn ghost small" onClick={setToday} title="Hôm nay">
                      Hôm nay
                    </button>
                    <button className="btn ghost small" onClick={setNext7Days} title="7 ngày">
                      7 ngày
                    </button>
                  </div>
                </div>
              </div>

              <TaskList tasks={paginatedTasks} onDelete={deleteTask} onEdit={openEdit} />

              {/* pagination if used */}
              <div className="mt-4">
                <Pagination page={page} setPage={setPage} totalPages={totalPages} />
              </div>
            </div>
          </div>

          {/* Right: Stats only (no inline edit form) */}
          <aside>
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Thống kê</h3>
                <button
                  className="btn small"
                  onClick={() => setShowStats((s) => !s)}
                  aria-expanded={showStats}
                >
                  {showStats ? "Ẩn" : "Xem"}
                </button>
              </div>

              {showStats ? (
                <div className="mt-4">
                  <StatsPanel
                    completed={completedCount}
                    total={tasks.length}
                    pending={pendingCount}
                  />
                </div>
              ) : (
                <div className="mt-3 text-sm text-muted">Nhấn "Xem" để mở biểu đồ thống kê.</div>
              )}
            </div>

            {/* Add form: always available for creating new tasks */}
            <div className="card p-5 mt-4">
              <h3 className="text-lg font-medium mb-3">Thêm nhiệm vụ mới</h3>
              <TaskForm
                key="add-form"
                onAddTask={addTask}
              />
            </div>

          </aside>
        </div>
      </div>

      {/* Modal popup for editing */}
      {editing && (
        <div
          className="modal-overlay"
          onClick={() => setEditing(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>{`Chỉnh sửa: ${editing.title}`}</h3>
              <button type="button" className="btn ghost small" onClick={() => setEditing(null)}>Đóng</button>
            </div>

            <TaskForm
              initialTask={editing}
              onUpdateTask={handleSave}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}