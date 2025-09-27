import React, { useState } from "react";
import { Task } from "../types";
import Modal from "./Modal";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

const TaskItem: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // edit form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description ?? "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");
  const [editStatus, setEditStatus] = useState<Task["status"]>(task.status);
  const [error, setError] = useState("");

  function toggleComplete() {
    const updated: Task = {
      ...task,
      status: task.status === "completed" ? "pending" : "completed",
    };
    onEdit(updated);
  }

  function openEdit() {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditDueDate(task.dueDate ?? "");
    setEditStatus(task.status);
    setError("");
    setEditOpen(true);
  }

  function saveEdit() {
    if (!editTitle.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    const updated: Task = {
      ...task,
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      dueDate: editDueDate || undefined,
      status: editStatus,
    };
    onEdit(updated);
    setEditOpen(false);
  }

  return (
    <div className="task-item card-row" data-status={task.status}>
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.status === "completed"}
            onChange={toggleComplete}
            className="w-5 h-5 rounded"
            title="Đánh dấu hoàn thành"
          />
          <div style={{ minWidth: 0 }}>
            <div className="flex items-center gap-3">
              <h3
                className={`font-semibold truncate ${
                  task.status === "completed" ? "text-muted line-through" : ""
                }`}
                title={task.title}
              >
                {task.title}
              </h3>
              <span className={`badge ${task.status.replace(/\s/g, "-")}`}>
                {task.status}
              </span>
            </div>

            {/* show description if present */}
            {task.description ? (
              <p className="text-muted text-sm line-clamp-2" style={{ marginTop: 6 }}>
                {task.description}
              </p>
            ) : null}

            <div className="text-sm text-muted" style={{ marginTop: 6 }}>
              📅 {task.dueDate ?? "Không có hạn"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn small ghost" onClick={openEdit} type="button">
          Sửa
        </button>

        <button className="btn small" onClick={() => setConfirmOpen(true)} type="button">
          Xóa
        </button>
      </div>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Xác nhận xóa"
        confirmText="Xóa"
        onConfirm={() => {
          onDelete(task.id);
          setConfirmOpen(false);
        }}
      >
        <p>
          Bạn có chắc muốn xóa nhiệm vụ "<strong>{task.title}</strong>"?
        </p>
      </Modal>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Chỉnh sửa nhiệm vụ"
        confirmText="Lưu"
        onConfirm={saveEdit}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveEdit();
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-sm font-medium mb-1 block">Tiêu đề</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                setError("");
              }}
              placeholder="Nhập tiêu đề nhiệm vụ"
            />
            {error && <div className="text-sm text-danger mt-1">{error}</div>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Mô tả (tùy chọn)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Ngày</label>
              <input
                type="date"
                className="small-input"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Trạng thái</label>
              <select
                className="select-sm"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as Task["status"])
                }
              >
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskItem;