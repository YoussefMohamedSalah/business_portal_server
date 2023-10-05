import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Status } from "../enums/enums";
import { Contract } from "../entities/Contract";


//** Create New Request **
export const createContract = async (data: any, company: Company, project: Project, user: User) => {
    const { items, conditions, date, total_amount, vat, subcontractor, filesNameSetArray } = data;
    const contractRepository = getRepository(Contract);
    const contract = new Contract();
    contract.date = date;
    contract.conditions = conditions;
    contract.items = items;
    contract.total_amount = total_amount;
    contract.remaining_amount = total_amount;
    contract.vat = vat;
    contract.status = Status.PENDING;
    contract.work_flow = company.workFlow.contract_flow;
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

export const getAllCompanyContracts = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.Contracts",
            "contract"
        )
        .getOne();
    return company?.Contracts;
};

export const getAllCompany_pending_Contracts = async (companyId: string,) => {
    const ContractRepository = getRepository(Contract);
    const contracts = await ContractRepository
        .createQueryBuilder("contract")
        .where("contract.companyId = :companyId", { companyId: companyId })
        .andWhere('contract.status = :status', { status: Status.PENDING })
        .getMany();
    return contracts;
};

export const getAllProjectContracts = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.Contracts",
            "contract"
        )
        .getOne();
    return project?.Contracts;
};

export const getById = async (id: string) => {
    const ContractRepository = getRepository(Contract);
    const contract = await ContractRepository
        .createQueryBuilder("contract")
        .where("contract.id = :id", { id: id })
        .leftJoinAndSelect(
            "contract.invoices",
            "invoice"
        ).leftJoinAndSelect(
            'contract.company',
            'company'
        ).leftJoinAndSelect(
            'contract.project',
            'project'
        ).leftJoinAndSelect(
            'contract.subcontractor',
            'subcontractor'
        )
        .getOne();
    return contract;
}



