import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getGroupByProjectId } from '../repositories/GroupRepository';
import { CreateTaskInput } from '../types/CreateTaskInput';
import { createTask, getAllTasksByCompanyId, getById, getAllTasksByGroupId, getAllTasksByEmployeeId } from '../repositories/TaskRepository';
import { validateUUID } from '../utils/validateUUID';
import { TaskProgressType, taskType } from '../enums/enums';
import { Group } from '../entities/Group';
import { getWithGroupsById as getUserWithGroupsById } from '../repositories/UserRepository'
import { Task } from '../entities/Task';

// DONE
export const addTask = async (req: Request, res: Response) => {
	const { userId, companyId, userName } = req.userData!;
	const { task_type, name, description, task_priority, assigned_to, projectId, start_at, end_at } = req.body;
	if (!task_type) return res.json({ msg: "Task type is required" });

	console.log(task_priority)
	// first get company by id
	const company = await getCompanyById(companyId);
	if (!company) return res.json({ msg: "Company not found" });

	let group: Group | null = null;

	if (task_type === taskType.GROUP_TASK) {
		let groupData = await getGroupByProjectId(projectId);
		if (!groupData) return res.json({ msg: "Project's Group not found" });
		groupData.tasks_count = groupData.tasks_count + 1;
		let updatedGroup = await groupData.save()
		group = updatedGroup;
	}

	const createInput: CreateTaskInput = {
		name,
		description,
		task_priority,
		task_progress: TaskProgressType.ToDo,
		task_type,
		start_at,
		end_at,
		creator: { id: userId, name: userName },
		assigned_to,
	}

	let task = await createTask(company, group, createInput);
	if (!task) return res.json({ msg: "Task not created" });
	return res.json(task);
};

// DONE
export const updateTask = async (req: Request, res: Response) => {
	const { name, description, task_priority, task_progress } = req.body;
	const { id } = req.params;

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

	const task = await getById(id);
	if (!task) return res.json({ msg: "Task not found" });

	task.name = name ? name : task.name;
	task.description = description ? description : task.description;
	task.task_priority = task_priority ? task_priority : task.task_priority;
	task.task_progress = task_progress ? task_progress : task.task_progress;
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
	const { id } = req.params;

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

	const group = await getGroupByProjectId(id);
	if (!group) return res.json({ msg: "Project's Group not found" });
	const tasks = await getAllTasksByGroupId(group.id);
	if (!tasks) return res.json({ msg: "Tasks not found" });
	return res.json(tasks);
}


// DONE
export const getTasksByGroupId = async (req: Request, res: Response) => {
	const { id } = req.params;

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

	const tasks = await getAllTasksByGroupId(id);
	if (!tasks) return res.json({ msg: "Tasks not found" });
	return res.json(tasks);
}

// DONE
export const getTasksByCompanyId = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const tasks = await getAllTasksByCompanyId(companyId);
	if (!tasks) return res.json({ msg: "Tasks not found" });
	return res.json(tasks);
}

// DONE
export const getAllTasksByUserId = async (req: Request, res: Response) => {
	const { userId, companyId } = req.userData!;
	let companyTasks: Task[] = [];
	let groupsTasks: Task[] = [];
	let individualTasks: any[] = [];

	const user = await getUserWithGroupsById(userId)
	let groups = user?.groups;

	if (groups && groups.length > 0) {
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			let tasks = await getAllTasksByGroupId(group.id); // check this
			groupsTasks = [...groupsTasks, ...tasks]
		}
	}

	companyTasks = await getAllTasksByCompanyId(companyId)
	individualTasks = await getAllTasksByEmployeeId(userId)

	const tasks = {
		companyTasks,
		groupsTasks,
		individualTasks
	}
	return res.json(tasks);
}
