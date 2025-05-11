import React from 'react';
import { NavLink } from 'react-router';
import styles from './DrawerItem.module.css';
import { DnDItemTypes } from '@src/types/DnD';
import { useDrop } from 'react-dnd';

interface DragItem {
    priority: number
    id: string
}

interface DrawerItemProps {
    icon: (active: boolean) => React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    allowDropTask?: boolean;
    onDropTask?: (taskId: string) => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ 
    icon, 
    label, 
    href, 
    onClick,
    allowDropTask = false,
    onDropTask,
}) => {
    // Drag and drop
    const [ { isOver, isAllow }, dropRef ] = useDrop< DragItem, void, 
        { isOver: boolean, isAllow: boolean }
    >({
        accept: DnDItemTypes.TASK,
        canDrop: () => allowDropTask && !!onDropTask,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            isAllow: !!monitor.canDrop()
        }),
        drop: (item: DragItem) => {
            onDropTask?.(item.id);
        }
    });

    return href 
        ? (
            <NavLink ref={(e) => {dropRef(e)} } to={href} 
                className={({isActive}) => `${styles.drawerItem} ${isActive ? styles.active : ''} ${isOver ? styles.over : ''} ${!isAllow ? styles.notAllow : ''}`}
                onClick={onClick}
            >
                {({ isActive, isPending }) => (
                    <>
                        <div className={styles.drawerItemLeft}>
                            <div className={styles.iconContainer}>{icon(isActive)}</div>
                            <span className={`${styles.label} sub-title`}>{label}</span>
                        </div>
                        <div className={`${styles.drawerItemRight} ${isActive ? styles.active : ''}`}>
                            {/* render LoadingIndicator if isPending */}
                        </div>
                    </>
                )}
            </NavLink>
        )
        : (
            <div className={styles.drawerItem} onClick={onClick}>
                <div className={styles.drawerItemLeft}>
                    <div className={styles.iconContainer}>{icon(false)}</div>
                    <span className={`${styles.label} sub-title`}>{label}</span>
                </div>
            </div>
        );
}

export default DrawerItem;