import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { User } from "../entities/User";

// useless
export const addGroup = async (createData: any) => {
    const { name, description, project_managers, members, company } = createData;
    try {
        const groupRepository = getRepository(Group);
        const group = new Group();
        group.name = name;
        group.description = description;
        group.managers = project_managers;
        group.members = members;
        group.company = company;
        await groupRepository.save(group);
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error Adding Group:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const groupRepository = getRepository(Group);
        const group = await groupRepository
            .createQueryBuilder("group")
            .where("group.id = :id", { id: id })
            .getOne();
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};

export const getWithMembersById = async (id: string) => {
    try {
        const groupRepository = getRepository(Group);
        const group = await groupRepository
            .createQueryBuilder("group")
            .where("group.id = :id", { id: id })
            .leftJoinAndSelect('group.members', 'user')
            .leftJoinAndSelect('group.project', 'project')
            .getOne();
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};

export const getGroupByProjectId = async (projectId: string) => {
    try {
        const groupRepository = getRepository(Group);
        const group = await groupRepository
            .createQueryBuilder("group")
            .where("group.projectId = :projectId", { projectId: projectId })
            .leftJoinAndSelect('group.members', 'user')
            .getOne();
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const groupRepository = getRepository(Group);
        const group = await groupRepository
            .createQueryBuilder("group")
            .where("group.companyId = :companyId", { companyId: companyId })
            .leftJoinAndSelect('group.members', 'user')
            .orderBy("group.createdAt", "DESC")
            .getMany();
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};

export const addMember = async (addInput: { member: User, group: Group }) => {
    const { member, group } = addInput;
    try {
        group.members.push(member);
        group.members_count++;
        await group.save();
        return group;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};

export const removeMember = async (removeInput: { member: User, group: Group }) => {
    const { member, group } = removeInput;
    try {
        const groupMembers: User[] = group.members;
        let memberToBeRemoved = groupMembers.find(selectedMember => selectedMember.id === member.id)
        let newMembersArray = groupMembers.filter((member) => member !== memberToBeRemoved)
        group.members = [...newMembersArray];
        group.members_count--;
        await group.save();
    } catch (error) {
        // Handle the error
        console.error("Error retrieving Group:", error);
        return;
    }
};


