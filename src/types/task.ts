import type { Label } from "./label";


export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    label: Label | null;
    dueDate: Date | null;
    deleted?: boolean;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type TaskEntity = Optional<Omit<Task, 'label'> & {
    labelId: string | null;
}, 'id'> 

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export const taskStatusList = Object.values(TaskStatus);

export const taskStatusMap: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
}