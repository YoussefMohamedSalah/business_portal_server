import { getRepository } from "typeorm";
import { Department } from "../entities/Department";
import { Permission } from "../entities/Permission";
import { RequestWorkFlow } from "../entities/RequestWorkFlow";
import { Company } from "../entities/Company";

export const getDepartments = async () => {
	const departmentRepository = getRepository(Department);
	const department = await departmentRepository
		.createQueryBuilder("department")
		.getMany();
	return department;
};

export const addPermission = async (type: string, department: any) => {
	const permissionRepository = getRepository(Permission);
	const permission = new Permission();
	permission.type = type;
	permission.department = department;
	await permissionRepository.save(permission);
	return permission;
};

export const addInitialDepartments = async () => {
	let initialDepartments = ['Projects', 'HR', 'Finance', 'Marketing', 'Tender', 'Procurement'];
	let initialPermissions = ['can_read', 'can_write', 'can_update', 'can_delete']
	let departmentsList = [];
	try {
		for (let index = 0; index < initialDepartments.length; index++) {
			const department = Department.create({
				name: initialDepartments[index],
			});
			await department.save();
			for (let index2 = 0; index2 < initialPermissions.length; index2++) {
				await addPermission(initialPermissions[index2], department)
			}
			departmentsList.push(department)
		}
		return departmentsList || [];
	} catch (error) {
		console.log('error', error)
		return;
	}
};

export const addInitialWorkFlow = async (company: Company) => {
	try {
		const workflowRepository = getRepository(RequestWorkFlow);
		const workflow = new RequestWorkFlow();
		workflow.site_request_flow = [];
		workflow.petty_cash_request_flow = [];
		workflow.material_request_flow = [];
		workflow.contract_flow = [];
		workflow.company = company;
		await workflowRepository.save(workflow);
		return workflow;
	} catch (error) {
		console.log('error', error)
		return;
	}
};

