import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Dropdown, { type DropdownItem, type DropdownProps } from "../dropdown/Dropdown";
import styles from './LabelDropdown.module.css';
import type { Label, LabelEntity } from "@src/types/label";
import { useLabelData } from "@src/hooks/data";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { getRandomColor } from "@src/types/colors";

interface LabelDropdownProps {
    selectedLabelIds: string[];
    onSelectLabel?: (label: Label | null) => void;
    className?: string;
    placeholder?: string;
}

const LabelDropdown: React.FC<LabelDropdownProps> = ({
    selectedLabelIds,
    onSelectLabel,
    className,
    placeholder = "Add Label",
}) => {
    const { getLabels, addLabel } = useLabelData();
    const [ selectedLabels, setSelectedLabels ] = useState<Label[]>([]);
    const [ allLabels, setAllLabels ] = useState<Label[]>([]);

    const [ newLabelName, setNewLabelName ] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onClickCreateLabel = () => {
        setIsCreating(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCreateLabel = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newLabelName.trim()) {
            e.preventDefault();
            try {
                const newLabel : LabelEntity = {
                    name: newLabelName.trim(),
                    color: getRandomColor(),
                }

                const createdLabel = await addLabel(newLabel);
                setAllLabels([...allLabels, createdLabel]);
                onSelectLabel?.(createdLabel);

                setNewLabelName("");
                setIsCreating(false);
            } catch (error) {
                console.error("Failed to create label:", error);
            }
        }
    };

    const updateLabelState = async () => {
        const labels = await getLabels();
        setAllLabels(labels);
        if (selectedLabelIds.length > 0) {
            const selectedLabels = labels.filter((label) => selectedLabelIds.includes(label.id));
            setSelectedLabels(selectedLabels);
        } else {
            setSelectedLabels([]);
        }
    }

    const onOpenDropdown = async () => {
        updateLabelState();
    }

    useEffect(() => {
        updateLabelState();
    }, [selectedLabelIds]);

    const dropdownItems : (DropdownItem | ReactNode)[] = [
        ...allLabels.map((labelItem) => ({
            label: labelItem.name,
            onClick: () => onSelectLabel?.(labelItem),
            selected: selectedLabels.some((label) => label.id === labelItem.id),
        })),
        isCreating 
        ? (
            <div className={styles.createLabelContainer} onClick={(e) => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.createLabelInput}
                    placeholder="Create label"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    onKeyDown={handleCreateLabel}
                    autoFocus
                />
            </div>
        )
        : {
            label: "Create label",
            onClick: isCreating ? undefined : onClickCreateLabel,
            autoClose: false,
        }
    ];

    const getDropdownProps = () => {
        const props : DropdownProps = {
            label: placeholder,
            items: dropdownItems,
            className: `${styles.labelDropdown} ${className} `,
            dropdownIcon: <FaPlus />,
            onTriggerMenu: (isOpen) => (isOpen && onOpenDropdown()),
        }

        const deleteIcon = <div className={styles.iconContainer} onClick={(e) => {e.stopPropagation(); onSelectLabel?.(null);}}><IoClose /></div>;

        if (selectedLabels.length === 1) {
            const selectedLabel = selectedLabels[0];
            props.label = selectedLabel.name;
            props.className += `${selectedLabel.color}`;
            props.dropdownIcon = deleteIcon;
            return props;
        }

        if (selectedLabels.length > 1) {
            props.label = `${selectedLabels.length} labels`;
            props.className += `${styles.multipleLabels}`;
            props.dropdownIcon = deleteIcon;
            return props;
        }

        return props;
    }

    return (
        <Dropdown 
            {...getDropdownProps()}
        />
    );
};

export default LabelDropdown;