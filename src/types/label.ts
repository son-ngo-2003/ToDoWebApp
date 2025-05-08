import type { Color } from "./colors";

export interface Label {
    id: string;
    name: string;
    color: Color;
    deleted?: boolean;
}