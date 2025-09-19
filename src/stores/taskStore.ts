import { makeAutoObservable } from "mobx";
import { TaskStatus } from "../models/Task";
import { TaskService } from "../api/TaskService";

class TaskStore {
    tasks: any[] = [];
        isLoading = false;
        error = "";
  constructor() {
    makeAutoObservable(this);
  }

  get pendingCount() {
    return this.tasks.filter((t) => t.status === TaskStatus.Pending).length;
}

    get byStatus() {
        return (status : TaskStatus) =>
             this.tasks.filter((t) => t.status === status);
    }

    async loadAll() {
        this.isLoading = true;
        this.error = "";
        try{
            const data = await TaskService.listAll();
            this.tasks = data;
        } catch (e: any) {
            this.error = e.message || "Task yüklenemedi";
        } finally {
            this.isLoading = false;
        }
    }
}

export const taskStore = new TaskStore();