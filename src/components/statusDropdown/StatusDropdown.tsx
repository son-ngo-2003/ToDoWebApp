import React from "react";
import { TaskStatus, taskStatusList, taskStatusMap } from "@src/types/task";
import styles from "./StatusDropdown.module.css";
import Dropdown from "../dropdown/Dropdown";

const colorByStatus = {
    [TaskStatus.TODO]: 'yellow',
    [TaskStatus.IN_PROGRESS]: 'blue',
    [TaskStatus.DONE]: 'teal',
}

interface StatusDropdownProps {
    status: TaskStatus;
    onChange?: (status: TaskStatus) => void;
    className?: string;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
    status,
    onChange,
    className = "",
}) => {
    const handleStatusChange = (newStatus: TaskStatus) => {
        onChange?.(newStatus);
    };

    return (
        <div className={`${styles.statusDropdownContainer} ${className}`}>
            <Dropdown 
                label={ taskStatusMap[status] }
                items={ taskStatusList.map((s) => ({
                    label: taskStatusMap[s],
                    selected: status === s,
                    onClick: () => handleStatusChange(s),
                }))}    
                className={`${styles.statusDropdown} ${colorByStatus[status]}`}
            />
        </div>
    );
}

export default StatusDropdown;