import { Request, Response } from 'express';
import { addGroup, getAllByCompanyId, getById, addMember, removeMember, getGroupByProjectId, getWithMembersById } from '../repositories/GroupRepository';
import { validateUUID } from '../utils/validateUUID';
import { getById as getMemberById } from '../repositories/UserRepository';
import { getById as getCompanyById } from '../repositories/CompanyRepository'
import { getById as getProjectById } from '../repositories/ProjectRepository';


// useless
export const createGroup = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	const { members, managers, name, description } = req.body;
	try {
		const company = await getCompanyById(companyId)
		let groupName = `${name!} Group}`
		let groupDescription = `This Is Normal Group And This Group Responsible For ${members?.length!} Members.`
		let createData = {
			name: name ? name : groupName,
			description: description ? description : groupDescription,
			managers,
			members,
			company
		}
		const group = await addGroup(createData);
		return res.status(200).json(group);
	} catch (error) {
		console.error("Error Adding Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const updateGroup = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const { members, managers, name, description } = req.body;
		const group = await getById(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });
		if (name) group.name = name;
		if (description) group.description = description;
		if (members) group.members = members;
		if (managers) group.managers = managers;
		let updatedGroup = await group.save();
		return res.status(200).json(updatedGroup);
	} catch (error) {
		console.error("Error Adding Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const getGroupById = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		// this id is Project Id
		const group = await getWithMembersById(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });
		return res.status(200).json(group);
	} catch (error) {
		console.error("Error Retrieving Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const deleteGroup = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const group = await getById(id);
		if (!group) {
			return res.status(404).json({ msg: "Group not found" });
		}
		await group.remove();
		return res.status(404).json({ msg: "Group deleted" });
	} catch (error) {
		console.error("Error Deleting Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const allCompanyGroups = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	try {
		const groups = await getAllByCompanyId(companyId);
		if (!groups) return res.status(404).json({ msg: "Groups not found" });
		return res.status(200).json(groups);
	} catch (error) {
		console.error("Error Retrieving Groups:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};











export const removeUserFromGroup = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { memberId } = req.body;

	if (!id || !memberId) return res.status(400).json({ msg: "groupId or memberId is not provided" });

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });

	isValidUUID = validateUUID(memberId);
	if (!isValidUUID) return res.status(400).json({ msg: "memberId is not valid" });

	try {
		const group = await getWithMembersById(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });

		let project = group.project;

		const member = await getMemberById(id);
		if (!member) return res.status(404).json({ msg: "Member not found" });

		let removeInput = {
			member,
			group
		}
		let updatedGroup = await removeMember(removeInput);

		project.members_count--;
		await project.save();

		return res.status(200).json(updatedGroup);
	} catch (error) {
		console.error("Error Retrieving Groups:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const addUserToGroup = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { user } = req.body;

	if (!id || !user) return res.status(400).json({ msg: "groupId or user Data is not provided" });

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });

	try {
		const group = await getWithMembersById(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });

		const userIsExisting = group.members.find(member => member.id === user.id);
		if (userIsExisting) return res.status(400).json({ msg: "User already in group" });

		let addInput = {
			member: user,
			group
		}
		let updatedGroup = await addMember(addInput);
		if (!updatedGroup) res.status(400).json({ msg: "Filed To Add User To Group" });
		return res.status(200).json(updatedGroup);
	} catch (error) {
		console.error("Error Adding User To Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};





export const removeUserFromGroupByProjectId = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { memberId } = req.body;

	if (!id || !memberId) return res.status(400).json({ msg: "groupId or memberId is not provided" });

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });

	isValidUUID = validateUUID(memberId);
	if (!isValidUUID) return res.status(400).json({ msg: "memberId is not valid" });

	try {
		const project = await getProjectById(id);
		if (!project) return res.status(404).json({ msg: "Project not found" });

		const group = await getGroupByProjectId(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });

		const member = await getMemberById(memberId);
		if (!member) return res.status(404).json({ msg: "Member not found" });

		let removeInput = {
			member,
			group
		}

		await removeMember(removeInput);
		project.members_count = project.members_count - 1;
		await project.save()

		let projectToBeRemoved = member.projects_info.find(selectedProject => selectedProject.id === project.id);
		let newProjectsArray = member.projects_info.filter((project) => project !== projectToBeRemoved)
		member.projects_info = [...newProjectsArray];

		await member.save();

		return res.status(404).json({ msg: "User removed from group" });
	} catch (error) {
		console.error("Error Adding User To Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const addUserToGroupByProjectId = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { user } = req.body;

	if (!id || !user) return res.status(400).json({ msg: "projectId or user Data is not provided" });

	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "projectId is not valid" });
	try {
		const userData = await getMemberById(user.id);
		if (!userData) return res.status(404).json({ msg: "User not found" });

		const project = await getProjectById(id);
		if (!project) return res.status(404).json({ msg: "Project not found" });

		const group = await getGroupByProjectId(id);
		if (!group) return res.status(404).json({ msg: "Group not found" });

		const userIsExisting = group.members.find(member => member.id === user.id);
		if (userIsExisting) return res.status(400).json({ msg: "User already in group" });

		let addInput = {
			member: userData,
			group
		};

		let updatedGroup = await addMember(addInput);
		project.members_count = project.members_count + 1;
		await project.save();

		let projectToBeAdded = { id: project.id, name: project.name, longitude: project.longitude, latitude: project.latitude };
		userData.projects_info = [...userData.projects_info, projectToBeAdded];
		await userData.save();

		if (!updatedGroup) res.status(400).json({ msg: "Filed To Add User To Group" });
		return res.status(200).json(updatedGroup);
	} catch (error) {
		console.error("Error Adding User To Group:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};
