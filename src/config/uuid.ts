import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => {
    return uuidv4();
};