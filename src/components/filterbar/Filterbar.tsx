import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './Filterbar.module.css';
import { FiSearch } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';
import StatusDropdown from '../statusDropdown/StatusDropdown';
import LabelDropdown from '../labelDropdown/LabelDropdown';
import { TaskStatus } from '@src/types/task';
import type { Label } from '@src/types/label';
import { DatePickerInput } from '@mantine/dates';
import { LuCalendar } from 'react-icons/lu';
import dayjs from 'dayjs';

export interface FilterValues {
	searchValue: string;
	statuses: TaskStatus[];
	labels: Label[];
    dueDate: Date | null;
}

interface FilterbarRef {
    searchValue: string;
    selectedStatuses: TaskStatus[];
    selectedLabels: Label[];
    dueDate: Date | null;

    resetFilter: () => void;
    setSearchValue: (value: string) => void;
    setSelectedStatuses: (statuses: TaskStatus[]) => void;
    setSelectedLabels: (labels: Label[]) => void;
    setDueDate: (date: Date | null) => void;
}

interface FilterbarProps {
    onFilterChange?: (filter: FilterValues) => void;
    className?: string;
}

const Filterbar = forwardRef<FilterbarRef, FilterbarProps>(({
	onFilterChange,
	className = ''
}, ref) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
    const [dueDate, setDueDate] = useState<Date | null>(null);

	const resetFilter = () => {
		setSearchValue('');
		setSelectedStatuses([]);
		setSelectedLabels([]);
        setDueDate(null);
	}

    // Expose methods through ref
    useImperativeHandle(ref, () => ({
        searchValue,
        selectedStatuses,
        selectedLabels,
        dueDate,

        resetFilter,
        setSearchValue: (value: string) => {
            setSearchValue(value);
        },
        setSelectedStatuses,
        setSelectedLabels,
        setDueDate,
    }));

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const clearSearch = () => {
        setSearchValue('');
    };

    const handleStatusChange = (status: TaskStatus) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter(s => s !== status) // Remove status if already selected
            : [...selectedStatuses, status];
        setSelectedStatuses(newStatuses);
    };

    const handleLabelsChange = (label: Label | null) => {
        if (label === null) {
            setSelectedLabels([]);
            return;
        }

        const isSelected = selectedLabels.some(l => l.id === label.id);
        const newSelectedLabels = isSelected
			? selectedLabels.filter(l => l.id !== label.id) // Remove label if already selected
			: [...selectedLabels, label]; // Add label if not selected

        setSelectedLabels(newSelectedLabels);
    };

	useEffect(() => {
		onFilterChange?.({
			searchValue,
			statuses: selectedStatuses,
            labels: selectedLabels,
            dueDate,
		});
	}, [searchValue, selectedStatuses, selectedLabels, dueDate]);

    return (
        <div className={`${styles.filterbar} ${className}`}>
            <div className={styles.searchContainer}>
                <div className={styles.searchIcon}>
                    <FiSearch />
                </div>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className={`${styles.searchInput} text`}
                />
                {searchValue && (
                    <button className={styles.clearButton} onClick={clearSearch}>
                        <IoIosClose />
                    </button>
                )}
            </div>
            
            <div className={styles.filtersContainer}>
                <StatusDropdown
                    selectedStatus={selectedStatuses}
                    onSelectStatus={handleStatusChange}
                    className={styles.statusDropdown}
                    placeholder='Select status...'
                />
                
                <LabelDropdown
                    selectedLabelIds={selectedLabels.map(label => label.id)}
                    onSelectLabel={handleLabelsChange}
                    className={styles.labelDropdown}
                    placeholder='Select labels...'
                />

                <DatePickerInput
                    id="dueDate" required clearable
                    leftSection={<LuCalendar size={18} />}
                    placeholder="Select due date..."
                    value={dueDate}
                    onChange={(date) => date !== null ? setDueDate(dayjs(date).toDate()) : setDueDate(null)}
                    highlightToday={true}
                    classNames={{
                        input: styles.datePickerInput,
                        placeholder: styles.datePickerPlaceholder,
                    }}
                />
            </div>

            <div className={`button outline ${styles.clearFilterButton}`}>Clear Filter <IoIosClose/></div>
        </div>
    );
});

export default Filterbar;