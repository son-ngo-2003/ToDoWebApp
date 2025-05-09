import { db } from "@src/config/dexie"
import { generateId } from "@src/config/uuid";
import type { Task, TaskEntity } from "@src/types/task";
import { useEffect, useRef } from "react";

const useTaskData = () => {
    const lastPriority = useRef(0);

    const getPriority = () => {
        return (++lastPriority.current);
    }

    useEffect(() => {
        const getLastPriority = async () => {
            const lastTask = await db.tasks.orderBy('priority').last();
            if (lastTask) {
                lastPriority.current = (lastTask?.priority || 0);
            }
        }
        getLastPriority();
    }, []);

    const getTasks = async (): Promise<Task[]> => {
        const tasks = await db.tasks.orderBy('priority').filter( t => !t.deleted ).toArray();
        
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
        task.priority = getPriority();
        await db.tasks.add({...task, deleted: false});

        const label = task.labelId ? (await db.labels.get(task.labelId)) : null;
        return { ...task, id: task!.id, priority: task!.priority, label: label || null, deleted : false };
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
        return { ...task, priority: task.priority || getPriority(), id: task.id, label: label || null };
    };

    const increaseTaskPriority = async (taskId: string, value: number = 1) : Promise<Task> => {
        const task = await db.tasks.get(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        if (task.priority === undefined) {
            throw new Error("Task priority is needed!");
        }
        const newPriority = task.priority + value;
        const updatedTask = { ...task, priority: newPriority } as TaskEntity;
        return (await updateTask(updatedTask));
    }

    const updateTaskPriority = async (taskId: string, newPriority: number) : Promise<Task> => {
        const task = await db.tasks.get(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        const updatedTask = { ...task, priority: newPriority } as TaskEntity;
        return (await updateTask(updatedTask));
    }

    const updateLabelTask = async (taskId: string, labelId: string | null) : Promise<Task> => {
        const task = await db.tasks.get(taskId);
        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = { ...task, labelId } as TaskEntity;
        return (await updateTask(updatedTask));
    }

    const updateTaskStatus = async (taskId: string, status: string) : Promise<Task> => {
        const task = await db.tasks.get(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        const updatedTask = { ...task, status } as TaskEntity;
        return (await updateTask(updatedTask));
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

    return { getTasks, addTask, deleteTask, updateTask, 
        updateLabelTask, increaseTaskPriority, updateTaskPriority, updateTaskStatus,
    };
}

export default useTaskData;
