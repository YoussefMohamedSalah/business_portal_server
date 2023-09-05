import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateProjectInfo } from "src/types/CreateProject";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { CreateTaskInput } from "../types/CreateTaskInput";

// DONE
export const createTask = async (company: Company, project: Project, createInput: CreateTaskInput) => {
    const { name, description, status, priority } = createInput;
    // create Task
    const taskRepository = getRepository(Task);
    const task = new Task();
    task.name = name;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.company = company;
    task.project = project;
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
export const getAllByProjectId = async (projectId: string) => {
    const taskRepository = getRepository(Project);
    const tasks = await taskRepository
        .createQueryBuilder("task")
        .where("task.projectId = :projectId", { projectId: projectId })
        .getMany();
    return tasks;
};