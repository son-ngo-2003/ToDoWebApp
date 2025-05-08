import { TaskStatus, taskStatusList, taskStatusMap, type Task } from "@src/types/task";
import styles from './TaskTile.module.css';
import Checkbox from "../checkbox/Checkbox";
import Dropdown from "../dropdown/Dropdown";
import { LuCalendar } from "react-icons/lu";

const colorByStatus = {
    [TaskStatus.TODO]: 'yellow',
    [TaskStatus.IN_PROGRESS]: 'blue',
    [TaskStatus.DONE]: 'teal',
}

interface TaskTileProps {
    task: Task,
}

const TaskTile: React.FC<TaskTileProps> = ({ 
    task 
}) => {
    const getDeadlineStatus = (dueDate: Date) => {
        const today = new Date();
        const deadline = new Date(dueDate);
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        if (deadline < today) {
            return 'overdue';
        } else if (deadline.getTime() === today.getTime()) {
            return 'today';
        } else {
            return 'upcoming';
        }
    }

    return (
        <div className={`${styles.taskTile} card`}>
            <div className={`${styles.leftPart}`}>
                <Checkbox id={'1'}/>
            </div>

            <div className={`${styles.middlePart}`}>
                <h3 className="title">{task.title}</h3>
                <div className={`${styles.dateContainer} ${getDeadlineStatus(task.dueDate)}`}>
                    <LuCalendar size={17}/>
                    <p className="text">{task.dueDate.toLocaleDateString()}</p>
                </div>
            </div>

            <div className={`${styles.rightPart}`}>
                <Dropdown 
                    label={ taskStatusMap[task.status] }
                    items={ taskStatusList.map((status) => ({
                        label: taskStatusMap[status],
                        selected: task.status === status,
                    }))}    
                    className={`${colorByStatus[task.status]} ${styles.statusDropdown}`}
                />
            </div>
        </div>
    );
};

export default TaskTile;