import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { CreateTaskInput } from '../types/CreateTaskInput';
import { createTask, getAllByProjectId, getById } from '../repositories/TaskRepository';



// DONE
export const addTask = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { projectId } = req.params;
    if (!companyId || !projectId) return res.json({ msg: "Company id and project id are required" });
    const createInput: CreateTaskInput = req.body;

    // first get company by id
    const company = await getCompanyById(companyId);
    if (!company) return res.json({ msg: "Company not found" });
    // then get project by id
    const project = await getProjectById(projectId);
    if (!project) return res.json({ msg: "Project not found" });

    const task = await createTask(company, project, createInput);
    if (!task) return res.json({ msg: "Task not created" });
    return res.json(task);
};

// DONE
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, priority, status } = req.body;
    const task = await getById(id);
    if (!task) return res.json({ msg: "Task not found" });
    task.name = name ? name : task.name;
    task.description = description ? description : task.description;
    task.priority = priority ? priority : task.priority;
    task.status = status ? status : task.status;
    await task.save();
    return res.json(task);
};

// DONE
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await getById(id);
    if (!task) return res.json({ msg: "Task not found" });
    await task.remove();
    return res.json({ msg: "Task deleted" });
}

// DONE
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await getById(id);
    if (!task) return res.json({ msg: "Task not found" });
    return res.json(task);
}

// DONE
export const getAllTasksByProjectId = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const tasks = await getAllByProjectId(projectId);
    if (!tasks) return res.json({ msg: "Tasks not found" });
    return res.json(tasks);
}