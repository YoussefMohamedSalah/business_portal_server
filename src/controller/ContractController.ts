import { Request, Response } from 'express';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { validateUUID } from '../utils/validateUUID';
import { createContract, getAllCompanyContracts, getById, getAllProjectContracts } from '../repositories/ContractRepository';
import { checkAndParse, processNumber } from '../utils/checkAndParse';



export const addContract = async (req: Request, res: Response) => {
	const { projectId } = req.params;

	let isValidUUID = validateUUID(projectId);
	if (!isValidUUID) return res.status(400).json({ msg: "project Id is not valid" });
	const { companyId, userId } = req.userData!;
	const { subcontractor, items, conditions, date, vat, total_amount, filesNameSet } = req.body;

	try {
		let toCheckType: { [key: string]: number | string | undefined } = {
			vat: vat && processNumber('Vat', vat!),
			total_amount: total_amount && processNumber('Total Amount', total_amount!),
		};
		for (const property in toCheckType) {
			if (typeof toCheckType[property] === 'string') {
				return { msg: toCheckType[property] };
			}
		};
		let createInput = {
			subcontractor: checkAndParse(subcontractor!),
			items: checkAndParse(items!),
			conditions: checkAndParse(conditions!),
			date,
			vat: toCheckType.vat ? toCheckType.vat as number : 0,
			total_amount: toCheckType.total_amount ? toCheckType.total_amount as number : 0,
			filesNameSetArray: filesNameSet?.split(',')! || []
		}

		const company = await getCompanyWithWorkflow(companyId);
		if (!company) return res.status(404).json({ msg: "Company not found" });
		const user = await getUserById(userId);
		if (!user) return res.status(404).json({ msg: "User not found" });
		const project = await getProjectById(projectId);
		if (!project) return res.status(404).json({ msg: "Project not found" });
		const contract = await createContract(createInput, company, project, user)
		if (!contract) return res.status(404).json({ msg: "Field To Create Contract" });
		return res.json(contract);
	} catch (error) {
		// Handle the error
		console.error("Error Adding Contract:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const getAllContractsByCompany = async (req: Request, res: Response) => {
	const { companyId } = req.userData!;
	try {
		const contracts = await getAllCompanyContracts(companyId);
		if (!contracts) return res.status(404).json({ msg: "Contracts not found" });
		return res.json(contracts);
	} catch (error) {
		// Handle the error
		console.error("Error Retrieving Contracts:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const getAllContractsByProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	let isValidUUID = validateUUID(projectId);
	if (!isValidUUID) return res.status(400).json({ msg: "project Id is not valid" });
	try {
		const contracts = await getAllProjectContracts(projectId);
		if (!contracts) return res.status(404).json({ msg: "Contracts not found" });
		return res.json(contracts);
	} catch (error) {
		// Handle the error
		console.error("Error Retrieving Contracts:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};

export const getContractById = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const contract = await getById(id);
		if (!contract) return res.status(404).json({ msg: "Contract not found" });
		return res.json(contract);
	} catch (error) {
		// Handle the error
		console.error("Error Retrieving Contract:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};


export const deleteContract = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	try {
		const contract = await getById(id);
		if (!contract) return res.status(404).json({ msg: "Contract not found" });
		await contract.remove();
		return res.json({ msg: "Contract deleted" });
	} catch (error) {
		// Handle the error
		console.error("Error Deleting Contract:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};


export const updateContract = async (req: Request, res: Response) => {
	const { id } = req.params;
	let isValidUUID = validateUUID(id);
	if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
	const { date, conditions, items, total_amount, status, work_flow, vat } = req.body;
	try {
		let toCheckType: { [key: string]: number | string | undefined } = {
			vat: vat && processNumber('Vat', vat!),
			total_amount: total_amount && processNumber('Total Amount', total_amount!),
		};
		for (const property in toCheckType) {
			if (typeof toCheckType[property] === 'string') {
				return { msg: toCheckType[property] };
			}
		};

		const contract = await getById(id);
		if (!contract) return res.status(404).json({ msg: "Contract not found" });
		if (toCheckType.total_amount) contract.total_amount = toCheckType.total_amount as number;
		if (toCheckType.vat) contract.vat = toCheckType.vat as number;
		if(checkAndParse(items!)) contract.items = checkAndParse(items!);
		if(checkAndParse(conditions!)) contract.conditions = checkAndParse(conditions!);
		contract.date = date ? date : contract.date;
		contract.status = status ? status : contract.status;
		contract.status = status ? status : contract.status;
		contract.work_flow = work_flow ? work_flow : contract.work_flow;
		await contract.save();
		return res.json(contract);
	} catch (error) {
		// Handle the error
		console.error("Error Deleting Contract:", error);
		return res.status(500).json({ msg: "Internal server error" });
	}
};





