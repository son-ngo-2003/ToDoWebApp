import React from 'react';
import { NavLink } from 'react-router';
import styles from './DrawerItem.module.css';

interface DrawerItemProps {
    icon: (active: boolean) => React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, href, onClick }) => {
    return href 
        ? (
            <NavLink to={href} className={({isActive}) => `${styles.drawerItem} ${isActive ? styles.active : ''}`}
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