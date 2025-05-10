import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import styles from './HomePage.module.css';
import { ModalTaskForm, TaskTile } from '@src/components';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTaskData } from '@src/hooks/data';
import type { Task } from '@src/types/task';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
    const { getTasks, increaseTaskPriority, updateTaskPriority } = useTaskData();
    const allTasks = useLiveQuery( () => getTasks(), [], []);

    const [isOpenTaskForm, setIsOpenTaskForm] = React.useState(false);
    const [taskOpenned, setTaskOpened] = React.useState<Task | null>(null);

    const moveTask = async (dragId: string, dropId: string) => { // For drag and drop
        if (!allTasks) return;
        if (dragId === dropId) return;
        
        const dragIndex = allTasks.findIndex(task => task.id === dragId);
        const dropIndex = allTasks.findIndex(task => task.id === dropId);
        const direction = dragIndex > dropIndex ? 1 : -1;

        await updateTaskPriority(dragId, allTasks[dropIndex].priority);
        for (let i = dropIndex; i !== dragIndex; i += direction) {
            increaseTaskPriority(allTasks[i].id, direction);
        }
    }

    return (
        <>
            <h1 className="title">All Tasks</h1>
            <div className="separate-line"/>

            <div className={styles.buttonContainer}>
                <button 
                    className={`${styles.button} button`}
                    onClick={() => {
                        setIsOpenTaskForm(true);
                        setTaskOpened(null);
                    }}
                > 
                    <IoMdAddCircleOutline/> Add Task
                </button>
                <button className={`${styles.button} button outline`}><IoFilter /> Filter</button>
            </div>

            <div className={styles.tasksContainer}>
                { allTasks && allTasks.length > 0 
                    ?  (allTasks.map((task) => (
                            <TaskTile 
                                task ={task} key={task.id} 
                                onClick={() => {
                                    setIsOpenTaskForm(true);
                                    setTaskOpened(task);
                                }}
                                moveTask={moveTask}
                            />
                        ))) 
                    : <p className={`text`}>No tasks availabel.</p> 

                }
            </div>

            <ModalTaskForm 
                opened={isOpenTaskForm} onClose={()=>{
                    setIsOpenTaskForm(false);
                }}
                mode={taskOpenned ? "edit" : "add"}
                task={taskOpenned}    
            />
        </>
    );
};

export default HomePage;