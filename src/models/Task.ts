export enum TaskStatus {
    Pending = 0,
    Completed = 1,
    Rejected = 2,
}   

export enum AssignedDepartment {
     HR = 0,
    Sales = 1,
    Marketing = 2,
}

export interface TaskUserDto {
    id: number;
    name: string;
    
}

export interface TaskDto {
    id: number;
    title: string;
    description?: string;
    assignedDepartment: number;
    departmentName?: string;
    user:TaskUserDto;
    status: TaskStatus;
    updatedAt?: string; 
}