import { makeAutoObservable } from "mobx";
import { TaskDto, TaskStatus } from "../models/Task";
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
    async createTask(data: Partial<TaskDto>) {
        this.isLoading = true;
        this.error = "";
        try{
            const updated = await TaskService.create(data);
            this.tasks.push(updated);
        }catch (e: any) {
            this.error = e.message || "Task oluşturulamadı";
        }finally {
            this.isLoading = false;
        }
    }

    async updateTask(id: number, data: Partial<TaskDto>) {
        this.isLoading = true;
        this.error = "";
        try {
            const updated = await TaskService.update(id, data);
            this.tasks = this.tasks.map((task) => (task.id === id ? updated : task));
        } catch (e: any) {
            this.error = e.message || "Task güncellenemedi";
        } finally {
            this.isLoading = false;
        }
    }
    async updateTaskStatus(id: number, status: TaskStatus) {
        const prev = this.tasks.slice();
        this.tasks = this.tasks.map(t=> t.id === id ? { ...t, status } : t);
        try {
            const updated = await TaskService.updateStatus(id, status);
            this.tasks = this.tasks.map(t=> t.id === id ? updated : t);
        } catch (e: any) {
            this.error = e.message || "Task durumu güncellenemedi";
            this.tasks = prev; // Geri al
        }
    }
    async deleteTask(id :number){
        this.isLoading = true;
        this.error = "";
        try{
             await TaskService.delete(id);
            this.tasks = this.tasks.filter(task=>task.id !== id);
        }catch (e: any){
            this.error = e.message || "Task silinemedi";
        }finally{
            this.isLoading= false;
        }
    }

}
export const taskStore = new TaskStore();