import { useEffect, useState } from "react";
import { Task } from "../types";

type FilterType = "all" | Task["status"];

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_BASE = "/api";
export default function useTasks(perPage = 5) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // date filters
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  async function load() {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("perPage", String(perPage));

    // If UI "all" should exclude completed, request backend with status=active.
    if (filter === "all") {
      params.set("status", "active");
    } else {
      // filter is guaranteed to be a Task["status"] here
      params.set("status", filter);
    }

    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    const json = await res.json();
    setTasks(json.tasks || []);
    setTotalPages(json.totalPages || 1);
  }

  useEffect(() => {
    load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, dateFrom, dateTo]);

  // CRUD operations
  async function addTask(task: Task) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to add");
    await load();
  }

  async function deleteTask(id: number) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    await load();
  }

  async function editTask(updated: Task) {
    const res = await fetch(`${API_BASE}/tasks/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error("Edit failed");
    await load();
  }

  async function fetchStats() {
    const res = await fetch(`${API_BASE}/tasks/stats/all`);
    if (!res.ok) return { total: 0, completed: 0, pending: 0 };
    return await res.json();
  }

  async function fetchGlobalStats() {
    const res = await fetch(`${API_BASE}/tasks/stats/global`);
    if (!res.ok) throw new Error('Failed to fetch global stats');
    const raw = await res.json();

    // normalize / ensure numbers
    const total = Number(raw.total || 0);
    const completed = Number((raw.byStatus && raw.byStatus.completed) || raw.completed || 0);
    const pending = Number((raw.byStatus && raw.byStatus.pending) || raw.pending || 0);
    const percent = Number(raw.percent ?? (total === 0 ? 0 : Math.round((completed / total) * 100)));

    return { total, completed, pending, percent, raw };
  }

  function clearDateFilter() {
    setDateFrom(null);
    setDateTo(null);
  }

  return {
    tasks,
    addTask,
    deleteTask,
    editTask,
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    paginatedTasks: tasks,
    completedCount: tasks.filter((t) => t.status === "completed").length,
    pendingCount: tasks.filter((t) => t.status !== "completed").length,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    clearDateFilter,
    fetchStats,
    fetchGlobalStats,
  };
}