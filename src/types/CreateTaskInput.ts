import { taskType } from "../enums/enums";

export type CreateTaskInput = {
    name: string;
    description: string;
    status: string;
    task_priority: string;
    user: { id: string, name: string };
    task_type: taskType,
    start_at: string,
    end_at:string
};