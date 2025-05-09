import { type Task } from "@src/types/task";
import styles from './TaskTile.module.css';
import Checkbox from "../checkbox/Checkbox";
import { LuCalendar } from "react-icons/lu";
import LabelDropdown from "../labelDropdown/LabelDropdown";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import { useTaskData } from "@src/hooks/data";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { DnDItemTypes } from "@src/types/DnD";
import { useDrag } from "react-dnd";

interface TaskTileProps {
    task: Task,
    onClick?: () => void;
    onCheckboxChange?: (checked: boolean) => void;
}

const TaskTile: React.FC<TaskTileProps> = ({ 
    task,
    onClick,
    onCheckboxChange
}) => {
    const { updateLabelTask } = useTaskData();
    const [ isChecked, setIsChecked ] = useState<boolean>(false);
    const [isDragIndicatorHovered, setIsDragIndicatorHovered] = useState(false);

    const [{isDragging}, dragRef] = useDrag({
        type: DnDItemTypes.TASK,
        item: { id: task.id },
        canDrag: () => isDragIndicatorHovered,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const getDeadlineStatus = (dueDate: Date | null) => {
        if (!dueDate) {
            return 'no-deadline';
        }

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

    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
        if (onCheckboxChange) {
            onCheckboxChange(checked);
        }
    };

    return (
        <div ref={(ref) => {dragRef(ref)}} className={`${styles.taskTile} card ${isChecked ? styles.checked : ''}`} onClick={onClick}>
            <div className={`${styles.leftPart}`}>
                <Checkbox 
                    id={task.id}
                    onChange={handleCheckboxChange}
                />
            </div>

            <div className={`${styles.middlePart}`}>
                <h3 className="title">{task.title}</h3>
                <div className={`${styles.dateContainer} ${getDeadlineStatus(task.dueDate)}`}>
                    <LuCalendar size={17}/>
                    <p className="text">{task.dueDate ? task.dueDate.toLocaleDateString() : "No due date"}</p>
                </div>
            </div>

            <div className={`${styles.rightPart}`}>
                <div className={`${styles.dropdownContainer}`}>
                    <p className="text">Label</p>
                    <LabelDropdown 
                        labelId={task.label ? task.label.id : null} 
                        className={`${styles.labelDropdown}`}
                        onSelectLabel={(label) => updateLabelTask(task.id, label === null ? null : label.id)}
                    />
                </div>

                <div className={`${styles.dropdownContainer}`}>
                    <p className="text">Status</p>
                    <StatusDropdown
                        status={task.status}
                    />
                </div>
            </div>

            <div className={`${styles.dragIndicatorContainer}`}
                onMouseEnter={() => setIsDragIndicatorHovered(true)}
                onMouseLeave={() => setIsDragIndicatorHovered(false)}
            >
                <MdDragIndicator size={30}/>
            </div>
        </div>
    );
};

export default TaskTile;