export type CreateTaskInput = {
    name: string;
    description: string;
    status: string;
    task_priority: string;
    user: { id: string, name: string };
};