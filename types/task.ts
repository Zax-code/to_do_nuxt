type TaskStatus = 'OPEN' | 'IN PROGRESS' | 'DONE';

export default interface Task {
    id?: string;
    title: string;
    description: string;
    status: TaskStatus;
    index: number;
    createdAt : Date;
    lastUpdate : Date;
}