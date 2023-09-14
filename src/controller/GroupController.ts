import { Request, Response } from 'express';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { addGroup, getAllByCompanyId, getById, addMember, removeMember, getGroupByProjectId } from '../repositories/GroupRepository';
import { validateUUID } from '../utils/validateUUID';

// DONE
export const createGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { members, manager } = req.body;
    const project = await getProjectById(id);
    if (!project) {
        return res.status(404).json({ msg: "project not found" });
    }
    let groupName = `${manager.name}'s Group}`
    let groupDescription = `This is ${manager.name}'s Group And This Group Responsible For ${members.length} Members To Work On ${project.name} Project`
    let createData = {
        name: groupName,
        description: groupDescription,
        manager: manager,
        members: members
    }
    const group = await addGroup(createData, project);
    return res.json(group);
};

// DONE
export const updateGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { members, manager, name, description } = req.body;
    const group = await getById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    group.name = name;
    group.description = description;
    group.members = members;
    group.manager = manager;
    let updatedGroup = await group.save();
    return res.json(updatedGroup);
};

// DONE
export const getGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    // this id is Project Id
    const group = await getGroupByProjectId(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    return res.json(group);
};

// DONE
export const deleteGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const group = await getById(id);
    if (!group) {
        return res.status(404).json({ msg: "Group not found" });
    }
    await group.remove();
    return res.json({ msg: "Group deleted" });
};

// DONE
export const allCompanyGroups = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const groups = await getAllByCompanyId(companyId);
    if (!groups) {
        return res.status(404).json({ msg: "Groups not found" });
    }
    return res.json(groups);
};

// DONE
export const removeUserFromGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id || !userId) return res.status(400).json({ msg: "groupId or userId is not provided" });

    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });
    isValidUUID = validateUUID(userId);
    if (!isValidUUID) return res.status(400).json({ msg: "userId is not valid" });

    const group = await getById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const user = group.members.find(member => member.id === userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await removeMember(group, userId);
    return res.json({ msg: "User removed from group" });
};

// DONE
export const addUserToGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, userName } = req.body;
    if (!id || !userId || !userName) return res.status(400).json({ msg: "groupId or userId or userName is not provided" });

    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });
    isValidUUID = validateUUID(userId);
    if (!isValidUUID) return res.status(400).json({ msg: "userId is not valid" });

    const group = await getById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const user = group.members.find(member => member.id === userId);
    if (user) return res.status(400).json({ msg: "User already in group" });

    await addMember(group, userId, userName);
    return res.json({ msg: "User added to group" });
};