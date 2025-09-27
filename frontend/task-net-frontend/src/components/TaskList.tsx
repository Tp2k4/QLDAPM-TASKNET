import React from "react";
import { Task } from "../types";

type Props = {
  tasks: Task[];
  onEdit?: (t: Task) => void | Promise<void>;   // now uses shared Task type
  onDelete?: (id: number) => void | Promise<void>;
};

export default function TaskList({ tasks, onEdit, onDelete }: Props) {
  if (!tasks || tasks.length === 0) return <div className="text-muted text-sm">Không có nhiệm vụ</div>;

  const statusLabel = (s: Task["status"]) =>
    s === "pending" ? "Chưa làm" : s === "in-progress" ? "Đang làm" : "Hoàn thành";
  const statusClass = (s: Task["status"]) =>
    s === "pending" ? "pending" : s === "in-progress" ? "in-progress" : "completed";

  return (
    <div className="task-list" role="list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item" data-status={task.status} role="listitem" aria-label={task.title}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {task.title}
              </h4>

              <span className={`status-badge ${statusClass(task.status)}`}>
                <span className="dot" />
                {statusLabel(task.status)}
              </span>
            </div>

            {task.description && (
              <p className="text-muted text-sm" style={{ margin: "8px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {task.description}
              </p>
            )}

            {task.dueDate && <div className="text-sm text-muted" style={{ marginTop: 8 }}>Hạn: {task.dueDate}</div>}
          </div>

          <div className="btn-group" style={{ marginLeft: 12 }}>
            <button
              type="button"
              className="btn ghost small"
              onClick={async (e) => {
                e.stopPropagation(); // prevent outer handlers
                try {
                  if (!onEdit) return;
                  await onEdit(task);
                } catch (err) {
                  console.error("onEdit failed", err);
                }
              }}
              aria-label={`Sửa ${task.title}`}
            >
              Sửa
            </button>

            <button
              type="button"
              className="btn ghost small"
              onClick={async (e) => {
                e.stopPropagation();
                if (!onDelete) return;
                try {
                  await onDelete(task.id);
                } catch (err) {
                  console.error("onDelete failed", err);
                }
              }}
              aria-label={`Xóa ${task.title}`}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}