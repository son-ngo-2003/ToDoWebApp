import { type ReactNode, useEffect, useState } from 'react';
import styles from './dropdown.module.css';
import { IoIosArrowDown, IoIosAdd } from 'react-icons/io';
import { FaCheck } from "react-icons/fa6";
import React from 'react';

export interface DropdownItem {
	label: string;
	href?: string;
	onClick?: () => void;
	subItems?: DropdownItem[];
	icon?: ReactNode;
	selected?: boolean;
	autoClose?: boolean; // auto close the dropdown when clicking an item
};

export interface DropdownProps {
	label: string | ReactNode;
	items: (DropdownItem | ReactNode)[];
	className?: string;
	autoClosed?: boolean; // auto close the dropdown when clicking an item
	disabled?: boolean;
	dropdownIcon?: ReactNode | null; // default is IoIosArrowDown, if null, no icon will be shown
	onTriggerMenu?: ( isOpen: boolean ) => void; // callback when the trigger button is clicked
}

const Dropdown: React.FC<DropdownProps> = ({ 
	label, 
	items, 
	className, 
	autoClosed = true,
	disabled = false,
	dropdownIcon,
	onTriggerMenu,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = React.useRef<HTMLDivElement>(null);

	const toggleDropdown = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) {
			setIsOpen(false);
			return;
		}
		onTriggerMenu?.(!isOpen);
		setIsOpen(!isOpen);
	};

	const closeDropdown = () => {
		setIsOpen(false);
	};

	const renderDropdownItem = (_item: DropdownItem | ReactNode, index: number) => {
		if (React.isValidElement(_item)) {
			return <div key={index}>{_item}</div>;
		}
		const item = _item as DropdownItem;

		if (item.subItems && item.subItems.length > 0) {
			return <SubDropdown key={index} item={item} closeDropdown={(item.autoClose !== false && autoClosed) ? closeDropdown : undefined}/>;
		}

		return (
			<a 
				key={index} 
				href={item.href || '#'} 
				className={`${styles.dropdownLink} text`}
				onClick={(e) => {
					e.stopPropagation();
					if (item.onClick) {
						e.preventDefault();
						item.onClick?.();
					}
					(item.autoClose !== false) && autoClosed && closeDropdown();
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

	useEffect(() => {
		// If isOpen is true, add style display: block to styles.dropdownContainer immediately; if false, add style display: none after 200ms
		if (isOpen) {
			menuRef.current?.style.setProperty('display', 'block');
		} else {
			setTimeout(() => {
				menuRef.current?.style.setProperty('display', 'none');
			}, 200);
		}
	}, [isOpen]);

	return (
		<div className={`${styles.dropdownContainer} ${isOpen ? styles.opened : ''} ${className || ''} ${disabled ? styles.disabled : ''}`}>
			{isOpen && <div className={`overlay transparent`} onClick={(e) => { e.stopPropagation(); closeDropdown()}} />}
			
			<button 
				className={`${styles.dropdownTrigger} background text`} 
				onClick={toggleDropdown}
				aria-expanded={isOpen}
				aria-haspopup="true"
				type='button'
			>
				{label}
				{ dropdownIcon === undefined
					? <IoIosArrowDown className={isOpen ? styles.rotateIcon : ''} />
					: dropdownIcon
				}
			</button>

			<div ref={menuRef} className={`${styles.dropdownMenu} background ${isOpen ? styles.open : ''}`}>
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
					e.stopPropagation();
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