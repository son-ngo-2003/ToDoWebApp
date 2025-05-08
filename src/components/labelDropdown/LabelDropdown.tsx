import type { Task } from "@src/types/task";
import { FaPlus } from "react-icons/fa6";
import Dropdown from "../dropdown/Dropdown";
import styles from './LabelDropdown.module.css';
import type { Label } from "@src/types/label";

interface LabelDropdownProps {
    task: Task;
    className?: string;
}

const LabelDropdown: React.FC<LabelDropdownProps> = ({
    task,
    className,
}) => {
    return (
        <Dropdown 
            label={ task.label ? task.label.name : "Add Label" }
            items={ ([] as Label[]).map((label) => ({
                label: label.name,
            }))}    
            className={`${styles.labelDropdown} ${className} ${task.label ? task.label.color : styles.noLabel}`}
            dropdownIcon={ task.label ? null : <FaPlus />}
        />
    );
};

export default LabelDropdown;