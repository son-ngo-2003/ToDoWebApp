import type { Color } from "./colors";

export interface Label {
    id: string;
    name: string;
    color: Color;
    deleted?: boolean;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type LabelEntity = Optional<Label, "id">;