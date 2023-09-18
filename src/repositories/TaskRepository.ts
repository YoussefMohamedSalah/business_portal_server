import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Task } from "../entities/Task";
import { CreateTaskInput } from "../types/CreateTaskInput";
import { Group } from "../entities/Group";
import { taskType } from "../enums/enums";
import { User } from "../entities/User";


// DONE
// if company or group task type, users would be an empty array
export const createTask = async (company: Company, group: Group | null, createInput: CreateTaskInput) => {
    const { name, description, task_priority, creator, assigned_to, task_type, start_at, end_at, task_progress } = createInput;
    // create Task
    const taskRepository = getRepository(Task);
    const task = new Task();
    task.name = name;
    task.description = description;
    task.task_priority = task_priority;
    task.task_progress = task_progress;
    task.task_type = task_type;
    task.start_at = start_at;
    task.end_at = end_at;
    task.creator = creator;
    task.company = company;
    if (task_type === taskType.GROUP_TASK && group) {
        task.group = group;
        task.users = [];
    }
    if (task_type === taskType.GENERAL_TASK) {
        task.users = [];
    }
    if (task_type === taskType.INDIVIDUAL_TASK) {
        task.users = assigned_to;
    }
    await taskRepository.save(task);
    return task;
};


// DONE
export const getById = async (id: string) => {
    const taskRepository = getRepository(Task);
    const task = await taskRepository
        .createQueryBuilder("task")
        .where("task.id = :id", { id: id })
        .getOne();
    return task;
};

// DONE
export const getAllTasksByCompanyId = async (companyId: string) => {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .where("task.companyId = :companyId", { companyId: companyId })
        .andWhere('task.task_type = :task_type', { task_type: 'general_task' })
        .orderBy("task.createdAt", "DESC")
        .getMany();
    return tasks;
};


// DONE
export const getAllTasksByGroupId = async (groupId: string) => {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .where("task.groupId = :groupId", { groupId: groupId })
        .andWhere('task.task_type = :task_type', { task_type: 'group_task' })
        .getMany();
    return tasks;
};

// DONE
export const getAllTasksByEmployeeId = async (userId: string) => {
    const taskRepository = getRepository(Task);
    const TaskUsers = await taskRepository
        .createQueryBuilder('task')
        .innerJoinAndSelect('task.users', 'user')
        .where('user.id = :userId', { userId })
        .getMany();

    return TaskUsers;
};