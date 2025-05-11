import { type Task } from "@src/types/task";
import styles from './TaskTile.module.css';
import Checkbox from "../checkbox/Checkbox";
import { LuCalendar } from "react-icons/lu";
import LabelDropdown from "../labelDropdown/LabelDropdown";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import { useTaskData } from "@src/hooks/data";
import { useRef, useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { DnDItemTypes } from "@src/types/DnD";
import { useDrag, useDrop } from "react-dnd";
import { dateToString } from "@src/utils/date";
import StatusTick from "../statusTick/StatusTick";

interface TaskTileProps {
    task: Task,
    onClick?: () => void;
    onCheckboxChange?: (checked: boolean) => void;

    moveTask?: (dragId: string, dropId: string) => void; // For drag and drop
}

interface DragItem {
    priority: number
    id: string
}

const TaskTile: React.FC<TaskTileProps> = ({ 
    task,
    onClick,
    onCheckboxChange,
    moveTask
}) => {
    const taskRef = useRef<HTMLDivElement>(null);
    const { updateLabelTask, updateTaskStatus } = useTaskData();
    const [ isChecked, setIsChecked ] = useState<boolean>(false);
    const [isDragIndicatorHovered, setIsDragIndicatorHovered] = useState(false);

    const getWillDropPosition = ( draggingPriority: number, thisPriority: number ) => {
        if (draggingPriority < thisPriority) {
            return "below";
        } 

        if (draggingPriority > thisPriority) {
            return "above";
        }

        return null;
    }

    // Drag and drop
    const [ { willDropPosition }, dropRef] = useDrop<DragItem, void, 
        { willDropPosition: "above" | "below" | null }
    >({
        accept: DnDItemTypes.TASK,
        canDrop: () => !!moveTask,
        collect: (monitor) => ({
            willDropPosition: (monitor.getItem() && !!monitor.isOver()) ? getWillDropPosition(monitor.getItem().priority, task.priority) : null,
        }),
        drop: (item: DragItem) => {
            moveTask?.(item.id, task.id);
        }
    });

    const [{isDragging}, dragRef] = useDrag({
        type: DnDItemTypes.TASK,
        item: { id: task.id, priority: task.priority },
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

    const getDateShown = (dueDate: Date | null) => {
        if (!dueDate) {
            return 'No due date';
        }

        const deadlineStatus = getDeadlineStatus(dueDate);
        const date = dateToString(dueDate);
        switch (deadlineStatus) {
            case 'overdue':
                return `${date} - Overdue`;
            case 'today':
                return `Today`;
            case 'upcoming':
            default:
                return date;
        }
    }

    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
        if (onCheckboxChange) {
            onCheckboxChange(checked);
        }
    };


    const getClassName = () => {
        let className = `${styles.taskTile} card `;
        isChecked && (className += styles.checked + " ");
        isDragging && (className += styles.dragging + " ");
        willDropPosition === "above" && (className += styles.willDropAbove + " ");
        willDropPosition === "below" && (className += styles.willDropBelow + " ");
        return className;
    }

    dropRef(dragRef(taskRef));
    return (
        <div ref={taskRef} className={getClassName()} onClick={onClick}>
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
                    <p className="text">{getDateShown(task.dueDate)}</p>
                </div>

                <div className={`${styles.mobileLabelDropdown} ${task.label ? styles.hasLabel : ""}`}>
                    <LabelDropdown 
                        selectedLabelIds={task.label ? [task.label.id] : []} 
                        className={`${styles.labelDropdown}`}
                        onSelectLabel={(label) => updateLabelTask( task.id, (label == null || label.id === task.label?.id) ? null : label.id)}
                        disabled={true}
                    />
                </div>
            </div>

            <div className={`${styles.rightPart}`}>
                <div className={`${styles.dropdownContainer} ${styles.labelDropdown}`}>
                    <p className="text">Label</p>
                    <LabelDropdown 
                        selectedLabelIds={task.label ? [task.label.id] : []} 
                        className={`${styles.labelDropdown}`}
                        onSelectLabel={(label) => updateLabelTask( task.id, (label == null || label.id === task.label?.id) ? null : label.id)}
                    />
                </div>

                <div className={`${styles.dropdownContainer} ${styles.statusDropdown}`}>
                    <p className="text">Status</p>
                    <StatusDropdown
                        selectedStatus={[task.status]}
                        onSelectStatus={(status) => updateTaskStatus(task.id, status)}
                    />
                </div>

                <StatusTick status={task.status} className={styles.statusTick}/>
                
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