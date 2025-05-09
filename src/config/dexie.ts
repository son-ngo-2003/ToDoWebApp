import type { Label } from '@src/types/label';
import type { TaskEntity } from '@src/types/task';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('TodoApp') as Dexie & {
    labels: EntityTable<Label, 'id'>,
    tasks: EntityTable<TaskEntity, 'id'>,
}

db.version(1).stores({
    labels: 'id, name, deleted',
    tasks: 'id, title, description, dueDate, status, labelId, deleted, priority',
});

export { db };