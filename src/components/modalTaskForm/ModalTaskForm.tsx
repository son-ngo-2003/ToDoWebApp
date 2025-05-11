import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { Modal } from "@mantine/core";
import type { Task, TaskEntity } from "@src/types/task";
import { TaskStatus } from "@src/types/task";
import styles from "./ModalTaskForm.module.css";
import { DatePickerInput } from "@mantine/dates";
import { LuCalendar } from "react-icons/lu";
import StatusDropdown from "../statusDropdown/StatusDropdown";
import LabelDropdown from "../labelDropdown/LabelDropdown";
import { useTaskData } from "@src/hooks/data";
import { useTheme } from "@src/hooks/ui";

interface ModalTaskFormProps {
    opened: boolean;
    onClose?: () => void;

    mode?: "add" | "edit";
    task?: Task | null;
    onAddTask?: (task: Task) => void;
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (task: Task) => void;
}

const ModalTaskForm: React.FC<ModalTaskFormProps> = ({
    opened,
    onClose = () => {},
    mode = "add",
    task,
    onAddTask,
    onEditTask,
    onDeleteTask,
}) => {
    const { theme } = useTheme();
    const { addTask, updateTask, deleteTask } = useTaskData();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [labelId, setLabelId] = useState<string | null>(null);

    useEffect(() => {
        if (mode === "edit" && task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setDueDate(task.dueDate);
            setLabelId(task.label?.id || null);
        } else {
            setTitle("");
            setDescription("");
            setStatus(TaskStatus.TODO);
            setDueDate(null);
            setLabelId(null);
        }
    }, [mode, task, opened]);

    const handleSubmit = async () => {
        const updatedTaskEntity: TaskEntity = {
            id: mode === "add" ? undefined : task!.id,
            title,
            description,
            status,
            dueDate,
            labelId,
        };

        if (mode === "add") {
            const addedTask = await addTask(updatedTaskEntity);
            onAddTask?.(addedTask);
        } else if (mode === "edit") {
            const updatedTask = await updateTask(updatedTaskEntity);
            onEditTask?.(updatedTask);
        }

        onClose();
    };

    const handleDelete = async () => {
        if (mode === "edit" && task) {
            await deleteTask(task.id);
            onDeleteTask?.(task);
            onClose();
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} centered
            title={<p className="sub-title">{mode === "add" ? "Add a task" : "Modify your task"}</p>} 
            className={theme} padding={24} radius={10}
        >
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <input
                    type="text" placeholder="What to do? ..." required
                    value={title} onChange={(e) => {
                        setTitle(e.target.value);
                        e.target.style.height = "inherit";
                        e.target.style.height = `${e.target.scrollHeight}px`; 
                    }}
                    className={`${styles.titleInput} title`}
                />

                <div className={`${styles.formGroup} ${styles.horizontal}`}>
                    <label htmlFor="dueDate" className={`${styles.label} sub-title`}>Status</label>
                    <StatusDropdown
                        selectedStatus={[status]}
                        onSelectStatus={(newStatus) => setStatus(newStatus)}
                        className={styles.statusDropdown}
                    />
                </div>

                <div className="separate-line" />

                <div className={`${styles.formGroup} ${styles.horizontal}`}>
                    <label htmlFor="dueDate" className={`${styles.label} sub-title`}>Due Date</label>
                    <DatePickerInput
                        id="dueDate" required clearable
                        leftSection={<LuCalendar size={18} />}
                        placeholder="No due date"
                        value={dueDate}
                        onChange={(date) => date !== null ? setDueDate(dayjs(date).toDate()) : setDueDate(null)}
                        highlightToday={true}
                        classNames={{
                            input: styles.datePickerInput,
                            placeholder: styles.datePickerPlaceholder,
                        }}
                    />
                </div>

                <div className={`${styles.formGroup} ${styles.horizontal}`}>
                    <label htmlFor="dueDate" className={`${styles.label} sub-title`}>Label </label>
                    <LabelDropdown
                        selectedLabelIds={ labelId ? [labelId] : []}
                        onSelectLabel={(label) => {
                            setLabelId( (label == null || label.id === labelId) ? null : label.id)
                        }}
                        className={styles.labelDropdown}
                    />
                </div>

                <div className="separate-line" />

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={`${styles.label} sub-title`}>Description</label>
                    <textarea
                        placeholder="Add a description..."
                        value={description}
                        className={`${styles.descriptionTextarea} text`}
                        onChange={(e) => { setDescription(e.target.value); }}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    {mode === "edit" && (
                        <button
                            className={`${styles.deleteButton} button`}
                            onClick={handleDelete} type="button"
                        >
                            Delete
                        </button>
                    )}
                    
                    <button
                        className={`${styles.cancelButton} button outline`}
                        onClick={onClose} type="button"
                    >
                        Cancel
                    </button>
                    
                    <button className={`${styles.saveButton} button`} type="submit" >
                        {mode === "add" ? "Add" : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalTaskForm;