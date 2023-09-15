import { getById } from "../repositories/CompanyRepository";
import { Company } from "../entities/Company";
import { User } from "../entities/User";
import { createNotification } from "../repositories/NotificationRepository";

export const HandleEmployeesCount = async (term: string, value: User) => {
    let gender: string = value.gender;
    const companyId = value.company_info.id
    const company = await getById(companyId);
    if (!company) return;

    if (term === 'add') {
        if (gender === 'Male') {
            company.male_count++;
            company.employee_count++;
        } else if (gender === 'Female') {
            company.female_count++;
            company.employee_count++;
        } else if (gender !== 'Male' && gender !== 'Female') {
            company.male_count++;
            company.employee_count++;
        }
    } else if (term === 'remove') {
        if (gender === 'Male') {
            company.male_count--;
            company.employee_count--;
        } else if (gender === 'Female') {
            company.female_count--;
            company.employee_count--;
        }
    }
    await company.save();
};