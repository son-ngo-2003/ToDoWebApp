import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import styles from './TasksPage.module.css';
import { TaskTile } from '@src/components';
import { TaskStatus, type Task } from '@src/types/task';
import type { Label } from '@src/types/label';
import { Color } from '@src/types/colors';

interface TasksPageProps {}

export const allLabels : Label[] = [
    { id: '1', name: 'Work', color: Color.YELLOW },
    { id: '2', name: 'Personal', color: Color.PURPLE },
    { id: '3', name: 'Urgent', color: Color.YELLOW },
]

const task1 : Task = {
    id: '1',
    title: 'Task 1',
    description: 'Description for task 1',
    label: allLabels[0],
    status: TaskStatus.TODO,
    dueDate: new Date(),
}

const task2 : Task = {
    id: '2',
    title: 'Task 2',
    description: 'Description for task 2',
    label: null,
    status: TaskStatus.IN_PROGRESS,
    dueDate: new Date(),
}

const allTasks : Task[] = [
    task1,
    task2,
]

const TasksPage: React.FC<TasksPageProps> = () => {
    return (
        <div>
            <h1 className="title">All Tasks</h1>
            <div className="separate-line"/>

            <div className={styles.buttonContainer}>
                <button className={`${styles.button} button`}> <IoMdAddCircleOutline/> Add Task</button>
                <button className={`${styles.button} button outline`}><IoFilter /> Filter</button>
            </div>

            <div className={styles.tasksContainer}>
                {allTasks.map((task) => (
                    <TaskTile key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TasksPage;