import { db } from "@src/config/dexie"
import { generateId } from "@src/config/uuid";
import type { Task, TaskEntity } from "@src/types/task";

const useTaskData = () => {
    const getTasks = async (): Promise<Task[]> => {
        const tasks = await db.tasks.filter( t => !t.deleted ).toArray();
        
        return Promise.all(tasks.map(async (task: TaskEntity) => {
            const label = task.labelId ? await db.labels.get(task.labelId) : null;
            return {
                ...task,
                label            
            } as Task;
        }));
    };

    const addTask = async (task: TaskEntity) : Promise<Task> => {
        task.id = generateId();
        const id = await db.tasks.add({...task, deleted: false});
        if (!id) {
            throw new Error("Failed to add task");
        }
        const label = task.labelId ? (await db.labels.get(task.labelId)) : null;
        return { ...task, id, label: label || null, deleted : false };
    };

    const updateTask = async (task: TaskEntity) : Promise<Task> => {
        if (!task.id) {
            throw new Error("Task ID is required for update");
        }

        const nbUpdated = await db.tasks.update(task.id, task);
        if (nbUpdated === 0) {
            throw new Error("Task not found");
        }
        const label = task.labelId ? (await db.labels.get(task.labelId)) : null;
        return { ...task, id: task.id, label: label || null };
    };

    const updateLabelTask = async (taskId: string, labelId: string | null) : Promise<Task> => {
        const task = await db.tasks.get(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = { ...task, labelId } as TaskEntity;
        const nbUpdated = await db.tasks.update(taskId, updatedTask);
        if (nbUpdated === 0) {
            throw new Error("Task not found");
        }
        
        const label = labelId ? (await db.labels.get(labelId)) : null;
        return { ...task, id: taskId, label: label || null };
    }

    const deleteTask = async (id: string) : Promise<boolean> => {
        // Soft delete
        const task = await db.tasks.get(id);
        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = { ...task, deleted: true } as TaskEntity;
        return (await db.tasks.update(id, updatedTask)) > 0;
    };

    return { getTasks, addTask, updateTask, updateLabelTask, deleteTask };
}

export default useTaskData;
