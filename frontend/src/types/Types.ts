export interface UserCreate {
    email: string;
    password: string;
}

export interface Todo {
    id?: number;
    title: string;
    category: string;
    due_date: Date;
    owner_id: number;
}

export interface TodoCreate {
    title: string;
    category: string;
    due_date: Date;
}