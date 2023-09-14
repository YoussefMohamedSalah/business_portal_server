import { Request, Response } from 'express';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { addGroup, getAllByCompanyId, getById, addMember, removeMember, getGroupByProjectId, getWithMembersById } from '../repositories/GroupRepository';
import { validateUUID } from '../utils/validateUUID';
import { getById as getMemberById } from '../repositories/UserRepository';

// DONE
// export const createGroup = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     let isValidUUID = validateUUID(id);
//     if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
//     const { members, managers } = req.body;
//     const project = await getProjectById(id);
//     if (!project) return res.status(404).json({ msg: "project not found" });
    
//     let groupName = `${manager.name}'s Group}`
//     let groupDescription = `This is ${manager.name}'s Group And This Group Responsible For ${members.length} Members To Work On ${project.name} Project`
//     let createData = {
//         name: groupName,
//         description: groupDescription,
//         managers: managers,
//         members: members,
//         project
//     }
//     const group = await addGroup(createData);
//     return res.json(group);
// };

// DONE
export const updateGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { members, managers, name, description } = req.body;
    const group = await getById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    if(name) group.name = name;
    if(description) group.description = description;
    if(members) group.members = members;
    if(managers) group.managers = managers;
    let updatedGroup = await group.save();
    return res.json(updatedGroup);
};

// DONE
export const getGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    // this id is Project Id
    const group = await getWithMembersById(id);
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
    const { memberId } = req.body;
    if (!id || !memberId) return res.status(400).json({ msg: "groupId or memberId is not provided" });

    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });

    isValidUUID = validateUUID(memberId);
    if (!isValidUUID) return res.status(400).json({ msg: "memberId is not valid" });

    const group = await getWithMembersById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const member = await getMemberById(id);
    if (!member) return res.status(404).json({ msg: "Member not found" });

    await removeMember(group, memberId);
    return res.json({ msg: "User removed from group" });
};

// DONE
export const addUserToGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user } = req.body;
    if (!id || !user) return res.status(400).json({ msg: "groupId or user Data is not provided" });

    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "groupId is not valid" });

    const group = await getWithMembersById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const userIsExisting = group.members.find(member => member.id === user.id);
    if (userIsExisting) return res.status(400).json({ msg: "User already in group" });

    await addMember(group, user);
    return res.json({ msg: "User added to group" });
};