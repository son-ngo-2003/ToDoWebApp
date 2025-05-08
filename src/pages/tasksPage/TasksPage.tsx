import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import styles from './TasksPage.module.css';
import { TaskTile } from '@src/components';
import { TaskStatus, type Task } from '@src/types/task';

interface TasksPageProps {}

const task1 : Task = {
    id: '1',
    title: 'Task 1',
    description: 'Description for task 1',
    status: TaskStatus.TODO,
    dueDate: new Date(),
}

const task2 : Task = {
    id: '2',
    title: 'Task 2',
    description: 'Description for task 2',
    status: TaskStatus.IN_PROGRESS,
    dueDate: new Date(),
}

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
                <TaskTile task={task1}/>
                <TaskTile task={task2}/>
            </div>
        </div>
    );
};

export default TasksPage;