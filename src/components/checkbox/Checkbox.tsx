import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
    id: string;
    label?: string;
    onChange?: (checked: boolean) => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    onChange,
    className = '',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    return (
        <div className={`${styles.checkboxWrapper} ${className}`} onClick={(e) => e.stopPropagation()}>
            <input
                className={styles.inpCbx}
                id={id}
                type="checkbox"
                onChange={handleChange}
            />
            <label className={styles.cbx} htmlFor={id}>
                <span className={styles.cbxBox}>
                    <svg width="12px" height="10px">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                </span>
                {label && <span className={styles.cbxLabel}>{label}</span>}
            </label>
        </div>
    );
};

export default Checkbox;