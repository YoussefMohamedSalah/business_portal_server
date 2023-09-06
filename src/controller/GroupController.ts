import { Request, Response } from 'express';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { addGroup, getById } from '../repositories/GroupRepository';

// DONE
export const createGroup = async (req: Request, res: Response) => {
    const { id } = req.params;
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
export const getGroupById = async (req: Request, res: Response) => {
    const { id } = req.params;
    // this id is Project Id
    const group = await getById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    return res.json(group);
};