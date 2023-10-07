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

export const addInitialData = async () => {
    // first check if there is any departments exists
    // if there is departments, just skip creating departments
    let departmentsList = [];
    try {

        const departments = await getDepartments();
        if (!departments || departments && departments.length === 0) {
            let initialDepartments = ['Projects', 'HR', 'Finance', 'Marketing', 'Tender', 'Procurement']
            let initialPermissions = ['can_read', 'can_write', 'can_update', 'can_delete']
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
                return departmentsList;
            } catch (error) {
                console.log('error', error)
            }
        } else {
            departmentsList = departments;
        }
        // second part

        const workflowRepository = getRepository(RequestWorkFlow);
        const workflow = new RequestWorkFlow();
        workflow.site_request_flow = [];
        workflow.petty_cash_request_flow = [];
        workflow.material_request_flow = [];
        workflow.contract_flow = [];
        await workflowRepository.save(workflow);

        // data to be returned 
        const data: any = {
            departmentsList,
            workflow
        }
        return data;
    } catch (error) {
        // Handle the error
        console.error("Error Adding Initial Data:", error);
        return;
    }
};
