import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateSupplierInfo } from "src/types/CreateSupplier";
import { Supplier } from "../entities/Supplier";

// DONE
export const createSupplier = async (
    createData: CreateSupplierInfo,
    company: Company
) => {
    const { name, supplier_type, company_name, vat_on, Representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    // create Project
    const projectRepository = getRepository(Supplier);
    const project = new Supplier();
    project.name = name;
    project.supplier_type = supplier_type;
    project.company_name = company_name;
    project.vat_on = vat_on;
    project.Representative = Representative;
    project.phone_number = phone_number;
    project.email = email;
    project.country = country;
    project.city = city;
    project.area = area;
    project.street = street;
    project.building_number = building_number;
    project.postal_code = postal_code;
    project.company = company;
    await projectRepository.save(project);
    return project;
};

// DONE
export const getById = async (id: string) => {
    const supplierRepository = getRepository(Supplier);
    const supplier = await supplierRepository
        .createQueryBuilder("supplier")
        .where("supplier.id = :id", { id: id })
        .getOne();
    return supplier;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const supplierRepository = getRepository(Supplier);
    const supplier = await supplierRepository
        .createQueryBuilder("supplier")
        .where("supplier.companyId = :companyId", { companyId: companyId })
        .getMany();
    return supplier;
};



// export const getInventoryItemsById = async (id: string) => {
//     const supplierRepository = getRepository(Inventory);
//     const inventory = await supplierRepository
//         .createQueryBuilder("inventory")
//         .where("project.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "project.items",
//             "items"
//         )
//         .getOne();
//     return inventory;
// };

