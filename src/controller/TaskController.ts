import { Request, Response } from 'express';
import { getById as getCompanyById, getWithAllUsers } from '../repositories/CompanyRepository';
import { getGroupByProjectId } from '../repositories/GroupRepository';
import { CreateTaskInput } from '../types/CreateTaskInput';
import { createTask, getAllTasksByCompanyId, getById, getAllTasksByGroupId, getAllTasksByEmployeeId } from '../repositories/TaskRepository';
import { validateUUID } from '../utils/validateUUID';
import { TaskPriority, TaskProgressType, taskType } from '../enums/enums';
import { getAllCompanyUsers, getWithGroupsById as getUserWithGroupsById } from '../repositories/UserRepository'

export const addTask = async (req: Request, res: Response) => {
	const { userId, companyId, userName } = req.userData!;
	const { task_type, name, description, task_priority, assigned_to, projectId, start_at, end_at } = req.body;
	if (!task_type) return res.json({ msg: "Task type is required" });
	let isValidUUID = validateUUID(projectId);
	if (!isValidUUID) return res.status(400).json({ msg: "Project Id is not valid" });

	try {

		const company = await getCompanyById(companyId);
		if (!company) return res.json({ msg: "Company not found" });

		if (task_type === taskType.GROUP_TASK) {
			let groupData = await getGroupByProjectId(projectId);
			if (!groupData) return res.json({ msg: "Project's Group not found" });
			groupData.tasks_count = groupData.tasks_count + 1;
			let group = await groupData.save()

			let createData: CreateTaskInput = {
				name,
				description,
				task_priority: task_priority,
				task_progress: TaskProgressType.ToDo,
				task_type: taskType.GROUP_TASK,
				start_at,
				end_at,
				creator: { id: userId, name: userName },
				assigned_to: group.members,
			}

			let task = await createTask(createData, company, group);
			if (!task) return res.json({ msg: "Task not created" });
			return res.json(task);
		}

		const users = await getAllCompanyUsers(companyId);
		if (!users) return res.json({ msg: "Company not found" });


		const createData: CreateTaskInput = {
			name,
			description,
			task_priority,
			task_progress: TaskProgressType.ToDo,
			task_type: taskType.GENERAL_TASK,
			start_at,
			end_at,
			creator: { id: userId, name: userName },
			assigned_to: users,
		}

		if (name) createData.name = name;
		if (description) createData.description = description;
		if (task_priority) createData.task_priority = task_priority;
		if (start_at) createData.start_at = start_at;
		if (end_at) createData.end_at = end_at;
		if (assigned_to) createData.assigned_to = assigned_to;

		let task = await createTask(createData, company, '');
		if (!task) return res.json({ msg: "Task not created" });
		return res.json(task);
	} catch (error) {
		console.error("Error Adding Task:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const updateTask = async (req: Request, res: Response) => {
	const { name, description, task_priority, task_progress } = req.body;
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const task = await getById(id);
		if (!task) return res.json({ msg: "Task not found" });
		task.name = name ? name : task.name;
		task.description = description ? description : task.description;
		task.task_priority = task_priority ? task_priority : task.task_priority;
		task.task_progress = task_progress ? task_progress : task.task_progress;
		await task.save();
		return res.json(task);
	} catch (error) {
		console.error("Error Updating Task:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const task = await getById(id);
		if (!task) return res.json({ msg: "Task not found" });
		await task.remove();
		return res.json({ msg: "Task deleted" });
	} catch (error) {
		console.error("Error Deleting Task:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}

export const getTaskById = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const task = await getById(id);
		if (!task) return res.json({ msg: "Task not found" });
		return res.json(task);
	} catch (error) {
		console.error("Error Retrieving Task:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}

export const getAllTasksByProjectId = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const group = await getGroupByProjectId(id);
		if (!group) return res.json({ msg: "Project's Group not found" });
		const tasks = await getAllTasksByGroupId(group.id);
		if (!tasks) return res.status(404).json({ msg: "Tasks not found" });
		return res.json(tasks);
	} catch (error) {
		console.error("Error Retrieving Tasks:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}


export const getTasksByGroupId = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const tasks = await getAllTasksByGroupId(id);
		if (!tasks) return res.json({ msg: "Tasks not found" });
		return res.json(tasks);
	} catch (error) {
		console.error("Error Retrieving Tasks:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}

export const getTasksByCompanyId = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	try {
		const tasks = await getAllTasksByCompanyId(companyId);
		if (!tasks) return res.json({ msg: "Tasks not found" });
		return res.json(tasks);
	} catch (error) {
		console.error("Error Retrieving Tasks:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}

export const getAllTasksByUserId = async (req: Request, res: Response) => {
	const { userId, companyId } = req.userData!;
	let companyTasks;
	let groupsTasks;
	let individualTasks;
	try {
		const user = await getUserWithGroupsById(userId)
		let groups = user?.groups;

		if (groups && groups.length > 0) {
			for (let i = 0; i < groups.length; i++) {
				const group = groups[i];
				let tasks = await getAllTasksByGroupId(group.id);
				if (tasks) groupsTasks = [...tasks]
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
	} catch (error) {
		console.error("Error Retrieving Tasks:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
}
