import { TaskStatus } from "../../../models/Task";

export const statusMeta: Record<TaskStatus, { label: string; color: "default" |"success" | "warning" | "error"; }> = {
  [TaskStatus.Pending]:    { label: "Bekliyor",  color: "warning" },
  [TaskStatus.Rejected]:   { label: "Reddedildi", color: "error" },
  [TaskStatus.Completed]:  { label: "Tamamlandı", color: "success" },
};
export const allStatuses: TaskStatus[] = [
  TaskStatus.Pending,
  TaskStatus.Rejected,
  TaskStatus.Completed
];