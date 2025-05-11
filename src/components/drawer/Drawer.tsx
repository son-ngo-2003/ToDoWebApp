import { NavLink } from 'react-router';
import styles from './Drawer.module.css';
import { GoHome, GoHomeFill } from "react-icons/go";
import { ReactSVG } from 'react-svg';
import { Logo } from '@src/assets/svg';
import { useLabelData } from '@src/hooks/data';
import { useLiveQuery } from 'dexie-react-hooks';
import { FaRegMoon, FaSun } from 'react-icons/fa6';
import { useTheme } from '@src/hooks/ui';
import { Theme } from '@src/types/theme';
import { useState } from 'react';
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md';

interface DrawerProps {}

const Drawer: React.FC<DrawerProps> = () => {
    const { theme, toggleTheme } = useTheme();
    const { getLabels } = useLabelData();
    const lables = useLiveQuery(() => getLabels(), [], []);

    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <div className={styles.logoApp}>
                        <ReactSVG wrapper='span' src={Logo} />
                        <p className={`${styles.logoText} title`}>Todo App</p>
                    </div>

                    <div className={styles.headerButtonsContainer}>
                        <button className={`${styles.themeToggle} ${styles.headerButton}`} onClick={toggleTheme}>
                            {theme === Theme.DARK ? <FaRegMoon/> : <FaSun />}
                        </button>

                        <button className={`${styles.openToggle} ${styles.headerButton} ${!isOpen ? styles.toOpen : ''}`} onClick={toggleDrawer}>
                            <MdOutlineKeyboardDoubleArrowLeft />
                        </button>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.linksGroup}>
                        <DrawerItem 
                            icon={ (isActive) => isActive ? <GoHomeFill/> : <GoHome/> }
                            label="Home" href="/"
                        />
                    </div>

                    <div className={styles.linksGroup}>
                        <span className={`${styles.groupLabel} sub-title`}>Labels</span>
                        { lables && lables.length > 0 
                            ? lables.map((label) => (
                                <DrawerItem 
                                    key={label.id} 
                                    icon={() => <span className={styles.circleDot} style={{backgroundColor: `var(--${label.color})`}}/>}
                                    label={label.name} href={`/labels/${label.id}`}
                                    onClick={() => setIsOpen(false)}
                                />
                            ))
                            : <span className={`${styles.emptyLabel} text`}>No labels</span>
                        }
                    </div>
                </div>

            </div>
            <div className={`overlay ${!isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(false)}/>
        </>
        
    );
};


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
                <div className={styles.iconContainer}>{icon(false)}</div>
                <span className={styles.label}>{label}</span>
            </div>
        );
}

export default Drawer;