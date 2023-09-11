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
        .where("group.projectId = :projectId", { projectId: id })
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