import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Task } from "../entities/Task";
import { CreateTaskInput } from "../types/CreateTaskInput";
import { Group } from "../entities/Group";
import { taskType } from "../enums/enums";


export const createTask = async (createInput: CreateTaskInput, company: Company, group: Group | any) => {
    const { name, description, task_priority, creator, assigned_to, task_type, start_at, end_at, task_progress } = createInput;
    try {
        const taskRepository = getRepository(Task);
        const task = new Task();
        if (name) task.name = name;
        if (description) task.description = description;
        if (task_priority) task.task_priority = task_priority;
        if (task_progress) task.task_progress = task_progress;
        if (start_at) task.start_at = start_at;
        if (end_at) task.end_at = end_at;
        if (task_type) task.task_type = task_type;
        if (task_type === taskType.GROUP_TASK && group) task.group = group;
        if (task_type === taskType.INDIVIDUAL_TASK && assigned_to) task.users = assigned_to;
        task.creator = creator;
        task.company = company;
        await taskRepository.save(task);
        return task;
    } catch (error) {
        // Handle the error
        console.error("Error Creating Task:", error);
        return;
    }
};


export const getById = async (id: string) => {
    try {
        const taskRepository = getRepository(Task);
        const task = await taskRepository
            .createQueryBuilder("task")
            .where("task.id = :id", { id: id })
            .getOne();
        return task;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Task:", error);
        return;
    }
};

export const getAllTasksByCompanyId = async (companyId: string) => {
    try {
        const taskRepository = getRepository(Task);
        const tasks = await taskRepository
            .createQueryBuilder("task")
            .where("task.companyId = :companyId", { companyId: companyId })
            .andWhere('task.task_type = :task_type', { task_type: taskType.GENERAL_TASK })
            .orderBy("task.createdAt", "DESC")
            .getMany();
        return tasks;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tasks:", error);
        return;
    }
};


export const getAllTasksByGroupId = async (groupId: string) => {
    try {
        const taskRepository = getRepository(Task);
        const tasks = await taskRepository
            .createQueryBuilder("task")
            .where("task.groupId = :groupId", { groupId: groupId })
            .andWhere('task.task_type = :task_type', { task_type: taskType.GROUP_TASK })
            .getMany();
        return tasks;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tasks:", error);
        return;
    }
};

export const getAllTasksByEmployeeId = async (userId: string) => {
    try {
        const taskRepository = getRepository(Task);
        const TaskUsers = await taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.users', 'user')
            .where('user.id = :userId', { userId })
            .getMany();

        return TaskUsers;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tasks:", error);
        return;
    }
};