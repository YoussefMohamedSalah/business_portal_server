import { Company } from "../entities/Company";
import { User } from "../entities/User";
import { createNotification } from "../repositories/NotificationRepository";

export const HandleEmployeesCount = async (term: string, value: User) => {
    let company: Company = value.company;
    let gender: string = value.gender;

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
    let title = `Welcome To ${company.name}`;
    let content = `Hello ${value.first_name} ${value.last_name}, You've just Added To ${value.department_info.name} Department As ${value.business_title}.`;
    await createNotification(title, content, value.id)
};