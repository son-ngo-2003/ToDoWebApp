import { type ReactNode, useState } from 'react';
import styles from './dropdown.module.css';
import { IoIosArrowDown, IoIosAdd } from 'react-icons/io';
import { FaCheck } from "react-icons/fa6";

export interface DropdownItem {
	label: string;
	href?: string;
	onClick?: () => void;
	subItems?: DropdownItem[];
	icon?: ReactNode;
	selected?: boolean;
}

export interface DropdownProps {
	label: string;
	items: DropdownItem[];
	className?: string;
	autoClosed?: boolean; // auto close the dropdown when clicking an item
	disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
	label, 
	items, 
	className, 
	autoClosed = true,
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		if (disabled) {
			setIsOpen(false);
			return;
		}
		setIsOpen(!isOpen);
	};

	const closeDropdown = () => {
		setIsOpen(false);
	};

	const renderDropdownItem = (item: DropdownItem, index: number) => {
		if (item.subItems && item.subItems.length > 0) {
			return <SubDropdown key={index} item={item} closeDropdown={autoClosed ? closeDropdown : undefined}/>;
		}

		return (
			<a 
				key={index} 
				href={item.href || '#'} 
				className={`${styles.dropdownLink} text`}
				onClick={(e) => {
					if (item.onClick) {
						e.preventDefault();
						item.onClick?.();
					}
					autoClosed && closeDropdown();
				}}
			>
				<p className={`${styles.dropdownItem} text`}>
					{item.label}
					{item.icon && <span className={styles.icon}>{item.icon}</span>}
				</p>
				{item.selected && <span className={styles.icon}><FaCheck /></span>}
			</a>
		);
	};

	return (
		<div className={`${styles.dropdownContainer} ${isOpen ? styles.opened : ''} ${className || ''} ${disabled ? styles.disabled : ''}`}>
			{isOpen && <div className={`overlay transparent`} onClick={closeDropdown} />}
			
			<button 
				className={`${styles.dropdownTrigger} background text`} 
				onClick={toggleDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
				type='button'
			>
				{label}
				<IoIosArrowDown className={isOpen ? styles.rotateIcon : ''} />
			</button>

			<div className={`${styles.dropdownMenu} background ${isOpen ? styles.open : ''}`}>
				{items.map(renderDropdownItem)}
			</div>
		</div>
	);
};

interface SubDropdownProps {
	item: DropdownItem;
	closeDropdown?: () => void;
}

const SubDropdown: React.FC<SubDropdownProps> = ({ item, closeDropdown }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleSubDropdown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	const renderDropdownItem = (item: DropdownItem, index: number) => {
		if (item.subItems && item.subItems.length > 0) {
			return <SubDropdown key={index} item={item} closeDropdown={closeDropdown}/>;
		}

		return (
			<a 
				key={index} 
				href={item.href || '#'} 
				className={`${styles.dropdownLink} text`}
				onClick={(e) => {
					if (item.onClick) {
						e.preventDefault();
						item.onClick?.();
					}
					closeDropdown?.();
				}}
			>
				<p className={`${styles.dropdownItem} text`}>
					{item.label}
					{item.icon && <span className={styles.icon}>{item.icon}</span>}
				</p>
				{item.selected && <span className={styles.icon}><FaCheck /></span>}
			</a>
		);
	};

	return (
		<div className={`${styles.subDropdownContainer}`}>
			<button 
				className={`${styles.subDropdownTrigger} text`} 
				onClick={toggleSubDropdown}
				aria-expanded={isOpen}
			>
				{item.label}
				<IoIosAdd className={isOpen ? styles.rotateIcon : ''} />
			</button>

			<div className={`${styles.subDropdownMenu} ${isOpen ? styles.open : ''}`}>
				{item.subItems?.map(renderDropdownItem)}
			</div>
		</div>
	);
};

export default Dropdown;