import { apiClient } from "./apiClient";
import { TaskDto } from "../models/Task";

interface ApiResponse<T> {
    code: string;
    payload: T;
    message?: string;
}
// Geçici
export const TaskService = {

    async listAll(): Promise<TaskDto[]> {
        const res= await apiClient.get<ApiResponse<TaskDto[]>>("/task");
        return res.data.payload as TaskDto[];
    },

    async getById(id: number): Promise<TaskDto> {
        const res = await apiClient.get<ApiResponse<TaskDto>>(`/task/${id}`);
        return res.data.payload as TaskDto;
    },

    async create(data: Partial<TaskDto>): Promise<TaskDto> {
        const res = await apiClient.post<ApiResponse<TaskDto>>("/task", data);
        return res.data.payload as TaskDto;
    },

    async updateStatus(id: number, status: number): Promise<TaskDto> {
        const res = await apiClient.patch<ApiResponse<TaskDto>>(`/task/${id}/status`, { status });
        return res.data.payload as TaskDto;
    },
    
    async userAll(userId: number): Promise<TaskDto[]> {
        const res = await apiClient.get<ApiResponse<TaskDto[]>>(`/users/${userId}/task`);
        return res.data.payload as TaskDto[];
    }
};
    