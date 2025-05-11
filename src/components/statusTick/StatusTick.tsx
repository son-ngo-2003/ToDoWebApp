import { TaskStatus } from "@src/types/task";
import styles from "./StatusTick.module.css";
import { RiProgress5Line } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";


const colorByStatus = {
    [TaskStatus.TODO]: 'yellow',
    [TaskStatus.IN_PROGRESS]: 'blue',
    [TaskStatus.DONE]: 'teal',
}

const statusIcon = {
    [TaskStatus.TODO]: <MdCalendarMonth />,
    [TaskStatus.IN_PROGRESS]: <RiProgress5Line />,
    [TaskStatus.DONE]: <IoIosCheckmarkCircle />,
};

interface StatusTickProps {
    status: TaskStatus;
    className?: string;
}


const StatusTick: React.FC<StatusTickProps> = ({ status, className }) => {
    return (
        <div className={`${styles.statusTick} ${className}`} style={{ color: `var(--${colorByStatus[status]})` }}>
            {statusIcon[status]}
        </div>
    );
};

export default StatusTick;