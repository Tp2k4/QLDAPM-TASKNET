export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: "pending" | "in-progress" | "completed";
};