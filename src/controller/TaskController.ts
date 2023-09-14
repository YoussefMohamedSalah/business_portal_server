import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getGroupByProjectId } from '../repositories/GroupRepository';
import { CreateTaskInput } from '../types/CreateTaskInput';
import { getById as getEmployeeBuId } from '../repositories/UserRepository';
import { createGeneralTask, createGroupTask, createPersonalTask, getAllByCompanyId, getAllByGroupId, getById } from '../repositories/TaskRepository';
import { validateUUID } from '../utils/validateUUID';
import { taskType } from '../enums/enums';

// DONE
export const addTask = async (req: Request, res: Response) => {
    const { userId, companyId, userName } = req.userData!;
    const { task_type, name, description, task_priority, assigned_to, projectId, start_at, end_at } = req.body;
    if (!task_type) return res.json({ msg: "Task type is required" });

    // general_task
    if (task_type === taskType.GENERAL_TASK) {
        // first get company by id
        const company = await getCompanyById(companyId);
        if (!company) return res.json({ msg: "Company not found" });
        const createInput: CreateTaskInput = {
            name,
            description,
            task_priority,
            status: 'Pending',
            user: { id: userId, name: userName },
            task_type,
            start_at,
            end_at
        }
        let task = await createGeneralTask(company, createInput);
        if (!task) return res.json({ msg: "Task not created" });
        console.log(task)
        return res.json(task);

        // project_task
    } else if (task_type === taskType.GROUP_TASK) {
        // first get group by project id
        const group = await getGroupByProjectId(projectId);
        if (!group) return res.json({ msg: "Project's Group not found" });

        const createInput: CreateTaskInput = {
            name,
            description,
            task_priority,
            status: 'Pending',
            user: { id: userId, name: userName },
            task_type,
            start_at,
            end_at
        }
        let task = await createGroupTask(group, createInput);
        if (!task) return res.json({ msg: "Task not created" });

        group.tasks_count = group.tasks_count + 1;
        await group.save()

        return res.json(task);
    } else if (task_type === taskType.INDIVIDUAL_TASK) {
        // first get user by id
        const assignedTo = await getEmployeeBuId(assigned_to);
        if (!assignedTo) return res.json({ msg: "User not found" });
        const createInput: CreateTaskInput = {
            name,
            description,
            task_priority,
            status: 'Pending',
            user: { id: userId, name: userName },
            task_type,
            start_at,
            end_at
        }
        let task = await createPersonalTask(assignedTo, createInput);
        if (!task) return res.json({ msg: "Task not created" });
        return res.json(task);
    } else {
        return res.json({ msg: "Please Select Proper Task Type" })
    }
};

// DONE
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
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
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const task = await getById(id);
    if (!task) return res.json({ msg: "Task not found" });
    await task.remove();
    return res.json({ msg: "Task deleted" });
}

// DONE
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
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