import { db } from "@src/config/dexie"
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

    const addTask = async (task: Task) : Promise<Task> => {
        const taskEntity : TaskEntity = {...task, labelId: task.label?.id || null, deleted: false};
        const id = await db.tasks.add(taskEntity);
        return { ...task, id, deleted : false };
    };

    const updateTask = async (task: Task) : Promise<Task> => {
        if (!task.id) {
            throw new Error("Task ID is required for update");
        }

        const taskEntity : TaskEntity = {...task, labelId: task.label?.id || null, deleted: false};
        const nbUpdated = await db.tasks.update(task.id, taskEntity);
        if (nbUpdated === 0) {
            throw new Error("Task not found");
        }
        return task;
    };

    const deleteTask = async (id: string) : Promise<boolean> => {
        // Soft delete
        const task = await db.tasks.get(id);
        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = { ...task, deleted: true } as TaskEntity;
        return (await db.tasks.update(id, updatedTask)) > 0;
    };

    return { getTasks, addTask, updateTask, deleteTask };
}

export default useTaskData;
