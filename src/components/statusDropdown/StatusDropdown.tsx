import React from "react";
import { TaskStatus, taskStatusList, taskStatusMap } from "@src/types/task";
import styles from "./StatusDropdown.module.css";
import Dropdown, { type DropdownProps } from "../dropdown/Dropdown";

const colorByStatus = {
    [TaskStatus.TODO]: 'yellow',
    [TaskStatus.IN_PROGRESS]: 'blue',
    [TaskStatus.DONE]: 'teal',
}

interface StatusDropdownProps {
    selectedStatus: TaskStatus[];
    onSelectStatus?: (status: TaskStatus) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
    selectedStatus,
    onSelectStatus,
    className = "",
    placeholder = "No status",
    disabled = false,
}) => {

    const getDropdownProps = () => {
        const props : DropdownProps = {
            label: placeholder,
            items: taskStatusList.map((s) => ({
                label: taskStatusMap[s],
                selected: selectedStatus.includes(s),
                onClick: () => onSelectStatus?.(s),
            })),
            className: styles.statusDropdown,
            disabled,
        }

        if (selectedStatus.length == 1) {
            props.label = taskStatusMap[selectedStatus[0]];
            props.className = `${styles.statusDropdown} ${colorByStatus[selectedStatus[0]]}`;
            return props;
        }

        if (selectedStatus.length > 1) {
            props.label = `${selectedStatus.length} statuses`;
            className = `${styles.statusDropdown} ${styles.multipleStatus}`;
            return props;
        }

        return props;
    }

    return (
        <div className={`${styles.statusDropdownContainer} ${className}`}>
            <Dropdown 
                {...getDropdownProps()}
            />
        </div>
    );
}

export default StatusDropdown;