import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
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
        .leftJoinAndSelect('group.members', 'user')
        .getOne();
    return group;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const groupRepository = getRepository(Group);
    const group = await groupRepository
        .createQueryBuilder("group")
        .where("group.companyId = :companyId", { companyId: companyId })
        .leftJoinAndSelect('group.members', 'user')
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
export const removeMember = async (group: Group, member: User) => {
    const memberGroupRepository = getRepository(Group)
    const record = await memberGroupRepository
        .createQueryBuilder('group_member')
        .where('userId = :userId', { userId: member.id })
        .andWhere('groupId = :groupId', { groupId: group.id })
        .delete()






        
    // user.groups = user.groups.filter(filtered => filtered.id !== group.id);

    // group.members = group.members.filter((member: User) => member.id !== userId);
    // group.members_count--;

    // await group.save();
    // return group;
};


