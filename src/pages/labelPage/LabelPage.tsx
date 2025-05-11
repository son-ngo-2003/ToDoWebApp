import React from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { HiOutlineTag } from "react-icons/hi";
import styles from './LabelPage.module.css';
import { ColorTick, Filterbar, ModalTaskForm, TaskTile } from '@src/components';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLabelData, useTaskData } from '@src/hooks/data';
import type { Task } from '@src/types/task';
import type { FilterValues } from '@src/components/filterbar/Filterbar';
import type { Label } from '@src/types/label';
import type { Color } from '@src/types/colors';
import { useParams } from 'react-router';

interface LabelPageProps {}

const LabelPage: React.FC<LabelPageProps> = () => {
    const { labelId } = useParams<{ labelId: string }>(); 
    const [ pageLabel, setPageLabel ] = React.useState<Label | null>(null);

    const { getLabelById, updateLabel } = useLabelData();
    const { getTasksByFilter, increaseTaskPriority, updateTaskPriority } = useTaskData();

    const [isOpenTaskForm, setIsOpenTaskForm] = React.useState(false);
    const [taskOpenned, setTaskOpened] = React.useState<Task | null>(null);
    
    const [isOpenFilterbar, setIsOpenFilterbar] = React.useState(false);
    const [currentFilter, setCurrentFilter] = React.useState<FilterValues>({searchValue: "", statuses: [], labels: [], dueDate: null});
    const allTasks = useLiveQuery( () => getTasksByFilter(currentFilter), [currentFilter], []);

    const [ inputTitle, setInputTitle ] = React.useState<string>("");
    const handleChangeLabelName = async () => {
        if (!pageLabel) return;
        if (inputTitle !== pageLabel.name) {
            await updateLabel({ ...pageLabel, name: inputTitle });
        }
    }
    const handleChangeColor = async (color: Color) => {
        if (!pageLabel) return;
        if (color !== pageLabel.color) {
            await updateLabel({ ...pageLabel, color });
        }
    }

    useLiveQuery(async () => {
        if (!labelId) return;
        const label = await getLabelById(labelId);
        if (!label) throw new Error("Label not found");

        setPageLabel(label);
        setInputTitle(label.name);
        
    }, [labelId], []);
    
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

    const nbFilterApplied = currentFilter.searchValue ? 1 : 0 +
                            currentFilter.statuses.length +
                            currentFilter.labels.length;

    return (
        <>
            <div className={styles.titleContainer}>
                <ColorTick 
                    value={pageLabel?.color || null} onChange={handleChangeColor}
                    className={styles.colorTick}
                />
                <div className={styles.title}>
                    <input className={`title ${styles.titleInput}`}  type='text'
                        value={inputTitle} onChange={(e) => setInputTitle(e.target.value)}
                        size={inputTitle.length + 1} onBlur={handleChangeLabelName}
                        onKeyDown={(e) => {if (e.key === "Enter") e.currentTarget.blur()}}
                    />
                    <HiOutlineTag size={23}/>
                </div>
            </div>
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
                <button className={`${styles.button} button outline`}
                    onClick={() => setIsOpenFilterbar(!isOpenFilterbar)}
                >
                    <IoFilter /> Filter {nbFilterApplied > 0 ? `(${nbFilterApplied})` : ""}
                </button>
            </div>

            <div className={`${styles.filterbarContainer} ${isOpenFilterbar ? styles.open : ""}`}>
                <Filterbar onFilterChange={setCurrentFilter} fixFilterValues={{ labels: pageLabel ? [pageLabel] : [] }}/>
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

export default LabelPage;