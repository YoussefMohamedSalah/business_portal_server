import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Task } from "../entities/Task";
import { CreateTaskInput } from "../types/CreateTaskInput";
import { Group } from "../entities/Group";

// DONE
export const createGeneralTask = async (company: Company, createInput: CreateTaskInput) => {
    const { name, description, task_priority, status } = createInput;
    // create Task
    const taskRepository = getRepository(Task);
    const task = new Task();
    task.name = name;
    task.description = description;
    task.task_priority = task_priority;
    task.status = status;
    task.company = company;
    await taskRepository.save(task);
    return task;
};

// DONE
export const createGroupTask = async (group: Group, createInput: CreateTaskInput) => {
    const { name, description, status, task_priority } = createInput;
    // create Task
    const taskRepository = getRepository(Task);
    const task = new Task();
    task.name = name;
    task.description = description;
    task.status = status;
    task.task_priority = task_priority;
    task.group = group;
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
export const getAllByGroupId = async (groupId: string) => {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .where("task.groupId = :groupId", { groupId: groupId })
        .getMany();
    return tasks;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .where("task.companyId = :companyId", { companyId: companyId })
        .getMany();
    return tasks;
};