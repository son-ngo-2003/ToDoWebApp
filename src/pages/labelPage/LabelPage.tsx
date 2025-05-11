import React from 'react';
import { HiOutlineTag } from "react-icons/hi";
import styles from './LabelPage.module.css';
import { AlertPopup, ColorTick, PopupType, TaskListView, type AlertPopupProps } from '@src/components';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLabelData, useTaskData } from '@src/hooks/data';
import type { Label } from '@src/types/label';
import type { Color } from '@src/types/colors';
import { useNavigate, useParams } from 'react-router';
import { MdDeleteOutline } from 'react-icons/md';

interface LabelPageProps {}

const LabelPage: React.FC<LabelPageProps> = () => {
    const { labelId } = useParams<{ labelId: string }>(); 
    const [ pageLabel, setPageLabel ] = React.useState<Label | null>(null);
    const navigate = useNavigate();

    const { getLabelById, updateLabel, deleteLabel } = useLabelData();
    const { updateTasksWhenDeleteLabel } = useTaskData();

    const [ alertProps, setAlertProps ] = React.useState<AlertPopupProps>({isVisible: false} as AlertPopupProps);
    const [ inputTitle, setInputTitle ] = React.useState<string>("");
    
    const handleChangeLabelName = async () => {
        if (!pageLabel) return;
        if (inputTitle !== pageLabel.name) {
            await updateLabel({ ...pageLabel, name: inputTitle });
        }
    }
    
    const handleChangeColor = async (color: Color) => {
        if (!pageLabel) return;
        if (color !== pageLabel.color) {
            await updateLabel({ ...pageLabel, color });
        }
    }

    const onClickDeleteLabel = async () => {
        if (!pageLabel) return;
        setAlertProps({ 
            isVisible: true, 
            type: PopupType.WARNING, 
            message: "Do you really want to delete this label ?",
            withConfirmButton: true,
            onConfirm: async () => {
                await deleteLabel(pageLabel.id);
                await updateTasksWhenDeleteLabel(pageLabel.id);
                navigate("/");
            },
            withCancelButton: true,
        });
    }

    useLiveQuery(async () => {
        if (!labelId) return;
        const label = await getLabelById(labelId);
        if (!label) throw new Error("Label not found");

        setPageLabel(label);
        setInputTitle(label.name);
        
    }, [labelId], []);

    return (
        <>
            <div className={styles.titleContainer}>
                <ColorTick 
                    value={pageLabel?.color || null}
                    onChange={handleChangeColor}
                    className={styles.colorTick}
                />
                <div className={styles.title}>
                    <input
                        className={`title ${styles.titleInput}`}
                        type='text'
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        size={inputTitle.length + 1}
                        onBlur={handleChangeLabelName}
                        onKeyDown={(e) => {if (e.key === "Enter") e.currentTarget.blur()}}
                    />
                    <HiOutlineTag size={23}/>
                </div>

                <button
                    className={`${styles.themeToggle} ${styles.headerButton}`}
                    onClick={onClickDeleteLabel}
                >
                    <MdDeleteOutline />
                </button>
            </div>
            <div className="separate-line"/>

            <TaskListView
                fixFilterValues={{ labels: pageLabel ? [pageLabel] : [] }}
            />

            <AlertPopup
                {...alertProps}
            />
        </>
    );
};

export default LabelPage;