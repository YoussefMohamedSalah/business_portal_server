import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Status } from "../enums/enums";
import { Contract } from "../entities/Contract";
import { processNumber } from "../utils/checkAndParse";


export const createContract = async (data: any, company: Company, project: Project, user: User) => {
	const { items, conditions, date, total_amount, vat, subcontractor, filesNameSetArray } = data;

	try {
		let toCheckType: { [key: string]: number | string | undefined } = {
			vat: vat && processNumber('Vat', vat!),
			total_amount: total_amount && processNumber('Total Amount', total_amount!),
		};
		for (const property in toCheckType) {
			if (typeof toCheckType[property] === 'string') {
				return { msg: toCheckType[property] };
			}
		}
		const contractRepository = getRepository(Contract);
		const contract = new Contract();
		if (toCheckType.vat) contract.vat = toCheckType.vat as number;
		if (toCheckType.total_amount) {
			contract.total_amount = toCheckType.total_amount as number;
			contract.remaining_amount = toCheckType.total_amount as number;
		}
		if (date) contract.date = date;
		if (conditions) contract.conditions = conditions;
		if (items) contract.items = items;
		if (company.workFlow.contract_flow) contract.work_flow = company.workFlow.contract_flow
		contract.status = Status.PENDING;
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
	} catch (error) {
		// Handle the error
		console.error("Error adding contract:", error);
		return;
	}
};

export const getAllCompanyContracts = async (id: string,) => {
	try {
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
	} catch (error) {
		// Handle the error
		console.error("Error retrieving contracts:", error);
		return;
	}
};

export const getAllCompany_pending_Contracts = async (companyId: string,) => {
	try {
		const ContractRepository = getRepository(Contract);
		const contracts = await ContractRepository
			.createQueryBuilder("contract")
			.where("contract.companyId = :companyId", { companyId: companyId })
			.andWhere('contract.status = :status', { status: Status.PENDING })
			.getMany();
		return contracts;
	} catch (error) {
		// Handle the error
		console.error("Error retrieving contracts:", error);
		return;
	}
};

export const getAllProjectContracts = async (id: string,) => {
	try {
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
	} catch (error) {
		// Handle the error
		console.error("Error retrieving contracts:", error);
		return;
	}
};

export const getById = async (id: string) => {
	try {
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
	} catch (error) {
		// Handle the error
		console.error("Error retrieving contracts:", error);
		return;
	}

}



