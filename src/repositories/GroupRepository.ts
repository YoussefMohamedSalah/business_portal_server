import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { User } from "../entities/User";

// DONE
export const addGroup = async (createData: any) => {
    const { name, description, project_managers, members, company, project } = createData;
    const groupRepository = getRepository(Group);
    const group = new Group();
    group.name = name;
    group.description = description;
    group.managers = project_managers;
    group.members = members;
    group.project = project;
    group.company = company;
    await groupRepository.save(group);
    return group;
};

// DONE
export const getById = async (id: string) => {
    const groupRepository = getRepository(Group);
    const group = await groupRepository
        .createQueryBuilder("group")
        .where("group.id = :id", { id: id })
        .getOne();
    return group;
};

// DONE
export const getWithMembersById = async (id: string) => {
    const groupRepository = getRepository(Group);
    const group = await groupRepository
        .createQueryBuilder("group")
        .where("group.id = :id", { id: id })
        .leftJoinAndSelect('group.members', 'user')
        .getOne();
    return group;
};

// DONE
export const getGroupByProjectId = async (projectId: string) => {
    const groupRepository = getRepository(Group);
    const group = await groupRepository
        .createQueryBuilder("group")
        .where("group.projectId = :projectId", { projectId: projectId })
        .getOne();
    return group;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const groupRepository = getRepository(Group);
    const group = await groupRepository
        .createQueryBuilder("group")
        .where("group.companyId = :companyId", { companyId: companyId })
        .orderBy("group.createdAt", "DESC")
        .getMany();
    return group;
};


// DONE
export const addMember = async (group: Group, user: User) => {
    group.members.push(user);
    group.members_count++;
    await group.save();
    return group;
};

// DONE
export const removeMember = async (group: Group, userId: string) => {
    group.members = group.members.filter((member: User) => member.id !== userId);
    group.members_count--;
    await group.save();
    return group;
};


