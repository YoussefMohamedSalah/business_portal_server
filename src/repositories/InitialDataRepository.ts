import { getRepository } from "typeorm";
import { Department } from "../entities/Department";
import { Permission } from "../entities/Permission";

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

export const addInitialData = async (
    name: string,
) => {
    // first check if there is any departments exists
    // if there is departments, just skip creating departments
    let departmentsList = [];
    const departments = await getDepartments();
    if (!departments || departments && departments.length === 0) {
        let initialDepartments = [
            'HR', 'Finance', 'Marketing', 'Customer_supplier', 'Construction', 'Tender', 'Procurement', 'IT'
        ]
        let initialPermissions = [
            'can_read', 'can_write', 'can_update', 'can_delete'
        ]
        try {
            for (let index = 0; index < initialDepartments.length; index++) {
                const department = Department.create({
                    name: initialDepartments[index],
                });
                await department.save()
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
    return departmentsList;
};
