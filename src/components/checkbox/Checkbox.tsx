import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
    id: string;
    label?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    onChange,
    className = '',
}) => {
    return (
        <div className={`${styles.checkboxWrapper} ${className}`}>
            <input
                className={styles.inpCbx}
                id={id}
                type="checkbox"
                onChange={onChange}
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