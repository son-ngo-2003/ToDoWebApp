import { colorList, type Color } from "@src/types/colors";
import styles from './ColorTick.module.css';
import { Menu } from "@mantine/core";
import { useTheme } from "@src/hooks/ui";


interface ColorTickProps {
    value: Color | null;
    onChange?: (color: Color) => void;
    className?: string;
}

const ColorTick: React.FC<ColorTickProps> = ({
    value,
    onChange = () => {},
    className = "",
}) => {
    const { theme } = useTheme();

    return (
        <Menu position="bottom-start">
            <Menu.Target>
                <div className={`${styles.colorTick} ${className}`} style={{backgroundColor: value ? `var(--${value})` : 'transparent'}}/>
            </Menu.Target>

            <Menu.Dropdown className={`${styles.dropdown} ${theme}`}>
                {colorList.map((color, ind) => (
                    <div
                        key={ind} className={`${styles.colorTick} ${styles.dropdownItem} ${className}`} 
                        style={{backgroundColor: `var(--${color})`}}
                        onClick={() => onChange(color)}
                    />
                ))}
            </Menu.Dropdown>

        </Menu>
    );
}

export default ColorTick;