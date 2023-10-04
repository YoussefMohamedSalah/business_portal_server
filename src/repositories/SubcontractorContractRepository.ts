import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Status } from "../enums/enums";
import { SubcontractorContract } from "../entities/SubcontractorContract";


//** Create New Request **
export const createContract = async (data: any, company: Company, project: Project, user: User) => {
    const { items, conditions, date, total_value, vat, subcontractor, filesNameSetArray } = data;
    const contractRepository = getRepository(SubcontractorContract);
    const contract = new SubcontractorContract();
    contract.date = date;
    contract.conditions = conditions;
    contract.items = items;
    contract.total_value = total_value;
    contract.vat = vat;
    contract.status = Status.PENDING;
    contract.work_flow = company.workFlow.subcontractor_contract_flow;
    if (filesNameSetArray) contract.files = filesNameSetArray;
    contract.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    contract.project_details = {
        id: project.id,
        name: project.name,
    };
    contract.subcontractor_details = {
        id: subcontractor.id,
        name: subcontractor.representative ? subcontractor.representative : subcontractor.company_name,
    };
    contract.company = company;
    contract.project = project;
    contract.subcontractor = subcontractor;
    await contractRepository.save(contract);
    return contract;
}

export const getAllCompanySubcontractorContracts = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.subcontractorContracts",
            "subcontractor_contract"
        )
        .getOne();
    return company?.subcontractorContracts;
};

export const getAllCompany_pending_subcontractorContracts = async (companyId: string,) => {
    const subcontractorContractRepository = getRepository(SubcontractorContract);
    const contracts = await subcontractorContractRepository
        .createQueryBuilder("subcontractor_contract")
        .where("subcontractor_contract.companyId = :companyId", { companyId: companyId })
        .andWhere('subcontractor_contract.status = :status', { status: Status.PENDING })
        .getMany();
    return contracts;
};

export const getAllProjectSubcontractorContracts = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.subcontractorContracts",
            "subcontractor_contract"
        )
        .getOne();
    return project?.subcontractorContracts;
};

export const getById = async (id: string) => {
    const subcontractorContractRepository = getRepository(SubcontractorContract);
    const contract = await subcontractorContractRepository
        .createQueryBuilder("subcontractor_contract")
        .where("subcontractor_contract.id = :id", { id: id })
        .getOne();
    return contract;
}



