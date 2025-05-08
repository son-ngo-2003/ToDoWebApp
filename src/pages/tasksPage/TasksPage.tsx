import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import styles from './TasksPage.module.css';
import { TaskTile } from '@src/components';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTaskData } from '@src/hooks/data';

interface TasksPageProps {}

const TasksPage: React.FC<TasksPageProps> = () => {
    const { getTasks } = useTaskData();
    const allTasks = useLiveQuery( () => getTasks(), [], []);

    return (
        <div>
            <h1 className="title">All Tasks</h1>
            <div className="separate-line"/>

            <div className={styles.buttonContainer}>
                <button className={`${styles.button} button`}> <IoMdAddCircleOutline/> Add Task</button>
                <button className={`${styles.button} button outline`}><IoFilter /> Filter</button>
            </div>

            <div className={styles.tasksContainer}>
                { allTasks && allTasks.length > 0 
                    ?  (allTasks.map((task) => (
                            <TaskTile task ={task} key={task.id} />
                        ))) 
                    : <p className={`text`}>No tasks availabel.</p> 

                }
            </div>
        </div>
    );
};

export default TasksPage;