import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getById as getGroupByProjectId } from '../repositories/GroupRepository';
import { CreateTaskInput } from '../types/CreateTaskInput';
import { createGeneralTask, createGroupTask, getAllByCompanyId, getAllByGroupId, getById } from '../repositories/TaskRepository';



// DONE
export const addTask = async (req: Request, res: Response) => {
    const { userId, companyId, userName } = req.userData!;
    const { projectId } = req.params;
    const { task_type, name, description, task_priority } = req.body;
    if (!task_type) return res.json({ msg: "Task type is required" });

    if (task_type === "CompanyGroup") {
        // first get company by id
        const company = await getCompanyById(companyId);
        if (!company) return res.json({ msg: "Company not found" });
        const createInput: CreateTaskInput = {
            name: name,
            description: description,
            task_priority: task_priority,
            status: 'Pending',
            user: { id: userId, name: userName }
        }
        let task = await createGeneralTask(company, createInput);
        if (!task) return res.json({ msg: "Task not created" });
        return res.json(task);
    } else if (task_type === "ProjectGroup") {
        // first get company by id
        const group = await getGroupByProjectId(projectId);
        if (!group) return res.json({ msg: "Project's Group not found" });
        const createInput: CreateTaskInput = {
            name: name,
            description: description,
            task_priority: task_priority,
            status: 'Pending',
            user: { id: req.userData!.userId, name: userName }
        }
        let task = await createGroupTask(group, createInput);
        if (!task) return res.json({ msg: "Task not created" });
        return res.json(task);
    }
    return;
};

// DONE
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, task_priority, status } = req.body;
    const task = await getById(id);
    if (!task) return res.json({ msg: "Task not found" });
    task.name = name ? name : task.name;
    task.description = description ? description : task.description;
    task.task_priority = task_priority ? task_priority : task.task_priority;
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
    const group = await getGroupByProjectId(projectId);
    if (!group) return res.json({ msg: "Project's Group not found" });
    const tasks = await getAllByGroupId(group.id);
    if (!tasks) return res.json({ msg: "Tasks not found" });
    return res.json(tasks);
}

// DONE
export const getAllTasksByCompanyId = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const tasks = await getAllByCompanyId(companyId);
    if (!tasks) return res.json({ msg: "Tasks not found" });
    return res.json(tasks);
}