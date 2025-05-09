import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Dropdown, { type DropdownItem } from "../dropdown/Dropdown";
import styles from './LabelDropdown.module.css';
import type { Label, LabelEntity } from "@src/types/label";
import { useLabelData } from "@src/hooks/data";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { getRandomColor } from "@src/types/colors";

interface LabelDropdownProps {
    labelId: string | null;
    onSelectLabel?: (label: Label | null) => void;
    className?: string;
}

const LabelDropdown: React.FC<LabelDropdownProps> = ({
    labelId,
    onSelectLabel,
    className,
}) => {
    const { getLabels, addLabel } = useLabelData();
    const [ label, setLabel ] = useState<Label | null>(null);
    const [ allLabels, setAllLabels ] = useState<Label[]>([]);

    const [ newLabelName, setNewLabelName ] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelectLabel = (label: Label | null) => {
        if (label == null || label.id === labelId) {
            setLabel(null);
            onSelectLabel?.(null);
            return;
        }
        onSelectLabel?.(label);
    };

    const onClickCreateLabel = () => {
        setIsCreating(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const handleCreateLabel = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newLabelName.trim()) {
            e.stopPropagation();
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

    const onOpenDropdown = async () => {
        const labels = await getLabels();
        setAllLabels(labels);
        if (labelId) {
            const selectedLabel = labels.find((label) => label.id === labelId);
            setLabel(selectedLabel || null);
        }
    }

    useEffect(() => {
        const updateLabelState = async () => {
            const labels = await getLabels();
            setAllLabels(labels);
            if (labelId) {
                const selectedLabel = labels.find((label) => label.id === labelId);
                setLabel(selectedLabel || null);
            }
        }
        updateLabelState();
    }, [labelId]);

    const dropdownItems : (DropdownItem | ReactNode)[] = [
        ...allLabels.map((labelItem) => ({
            label: labelItem.name,
            onClick: () => handleSelectLabel(labelItem),
            selected: labelId === labelItem.id
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

    return (
        <Dropdown 
            label={ label ? label.name : "Add Label" }
            items={dropdownItems}    
            className={`${styles.labelDropdown} ${className} ${label ? label.color : styles.noLabel}`}
            dropdownIcon={ 
                label 
                ? <div className={styles.iconContainer} onClick={(e) => {e.stopPropagation(); handleSelectLabel(null);}}><IoClose /></div> 
                : <FaPlus />}
            onTriggerMenu={(isOpen) => (isOpen && onOpenDropdown())}
        />
    );
};

export default LabelDropdown;