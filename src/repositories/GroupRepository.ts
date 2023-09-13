import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { Project } from "../entities/Project";

// DONE
export const addGroup = async (createData: any, project: Project) => {
    const { name, description, manager, members } = createData;
    const groupRepository = getRepository(Group);
    const group = new Group();
    group.name = name;
    group.description = description;
    group.manager = manager;
    group.members = members;
    group.project = project;
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
export const addMember = async (group: Group, userId: string, userName: string) => {
    group.members.push({ id: userId, name: userName });
    group.members_count++;
    await group.save();
    return group;
};

// DONE
export const removeMember = async (group: Group, userId: string) => {
    group.members = group.members.filter((member: { id: string, name: string }) => member.id !== userId);
    group.members_count--;
    await group.save();
    return group;
};