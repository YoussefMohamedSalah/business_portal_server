import { User } from "../entities/User";
import { taskType } from "../enums/enums";

export type CreateTaskInput = {
    name: string;
    description: string;
    status: string;
    task_priority: string;
    creator: { id: string, name: string };
    assigned_to: User[],
    task_type: taskType,
    start_at: string,
    end_at:string
};