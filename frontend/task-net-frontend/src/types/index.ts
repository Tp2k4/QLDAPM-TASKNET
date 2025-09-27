export type Task = {
  id: number;
  title: string;
  status: "completed" | "pending" | "in-progress";
  dueDate: string;
  description: string;
};

export type Filter = "all" | Task["status"];