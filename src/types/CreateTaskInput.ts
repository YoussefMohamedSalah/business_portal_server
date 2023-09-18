import { User } from "../entities/User";
import { TaskProgressType, taskType } from "../enums/enums";

export type CreateTaskInput = {
    name: string;
    description: string;
    task_progress: TaskProgressType;
    task_priority: string;
    creator: { id: string, name: string };
    assigned_to: User[],
    task_type: taskType,
    start_at: string,
    end_at:string
};