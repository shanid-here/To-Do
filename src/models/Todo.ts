export interface Todo {
    id: string;
    text: string;
    subtitle?: string;
    time?: string;
    isCompleted: boolean;
    createdAt: number;
    priority?: 'Low' | 'Medium' | 'High';
    reminder?: string;
    date?: string; // YYYY-MM-DD
}
