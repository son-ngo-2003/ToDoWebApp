import { db } from "@src/config/dexie"
import type { Label } from "@src/types/label";

const useLabelData = () => {
    const getLabels = async () : Promise<Label[]> => {
        return await db.labels.where({deleted: false}).toArray();
    };

    const addLabel = async (label: Label) : Promise<Label> => {
        const id = await db.labels.add(label);
        return { ...label, id, deleted : false };
    };

    const updateLabel = async (label: Label) : Promise<Label> => {
        if (!label.id) {
            throw new Error("Label ID is required for update");
        }

        const nbUpdated = await db.labels.update(label.id, label);
        if (nbUpdated === 0) {
            throw new Error("Label not found");
        }
        return label;
    };

    const deleteLabel = async (id: string) : Promise<boolean> => {
        // Soft delete
        const label = await db.labels.get(id);
        if (!label) {
            throw new Error("Label not found");
        }

        const updatedLabel = { ...label, deleted: true };
        return await db.labels.update(id, updatedLabel) > 0;
    };

    return { getLabels, addLabel, updateLabel, deleteLabel };
}

export default useLabelData;