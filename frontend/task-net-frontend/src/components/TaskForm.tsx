import React, { useEffect, useState } from "react";
import { Task } from "../types";

type TaskFormProps = {
  initialTask?: Task;
  onAddTask?: (task: Task) => Promise<void>;
  onUpdateTask?: (task: Task) => Promise<void>;
  onCancel?: () => void;
};

export default function TaskForm({ initialTask, onAddTask, onUpdateTask, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [status, setStatus] = useState<Task["status"]>(initialTask?.status ?? "pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialTask?.title ?? "");
    setDescription(initialTask?.description ?? "");
    setDueDate(initialTask?.dueDate ?? "");
    setStatus(initialTask?.status ?? "pending");
  }, [initialTask]);

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("Tiêu đề không được để trống.");
      return;
    }

    const payload: Task = {
      id: initialTask?.id ?? Date.now(),
      title: trimmedTitle,
      description: description.trim() || "no description",
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      status,
    };

    try {
      setLoading(true);
      if (initialTask && onUpdateTask) {
        await onUpdateTask(payload);
      } else if (!initialTask && onAddTask) {
        await onAddTask(payload);
        // reset after add
        setTitle("");
        setDescription("");
        setDueDate("");
        setStatus("pending");
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Lưu thất bại. Thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSave}>
      <div className="form-group">
        <label className="form-title">Tiêu đề</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Nhập tiêu đề..."
          aria-label="Tiêu đề"
        />
      </div>

      <div className="form-group">
        <label className="form-title">Mô tả</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="form-row inline">
        <div style={{ flex: 1 }}>
          <label className="form-title">Hạn</label>
          <input className="small-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div style={{ width: 160 }}>
          <label className="form-title">Trạng thái</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])} className="select-sm">
            <option value="pending">Chưa làm</option>
            <option value="in-progress">Đang làm</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <div className="btn-group">
          <button type="submit" className="btn small" disabled={loading}>
            {initialTask ? "Lưu" : "Thêm"}
          </button>
          {initialTask ? (
            <button type="button" className="btn ghost small" onClick={onCancel} disabled={loading}>
              Hủy
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}