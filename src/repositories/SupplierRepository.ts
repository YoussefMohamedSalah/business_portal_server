import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateSupplierInfo } from "src/types/CreateSupplier";
import { Supplier } from "../entities/Supplier";
import { processNumber } from "../utils/checkAndParse";

// DONE
export const createSupplier = async (
    createData: CreateSupplierInfo,
    company: Company
) => {
    const {
        name,
        supplier_type,
        company_name,
        vat_on,
        representative,
        phone_number,
        email,
        country,
        city,
        area,
        street,
        building_number,
        postal_code
    } = createData;

    try {
        let toCheckType: { [key: string]: number | string | undefined } = {
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
            vat: vat_on && processNumber('Vat', vat_on!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        const supplierRepository = getRepository(Supplier);
        const supplier = new Supplier();
        if (toCheckType.postal_code) supplier.postal_code = toCheckType.vat as number;
        if (toCheckType.vat_on) supplier.vat_on = toCheckType.vat as number;
        supplier.name = name;
        supplier.supplier_type = supplier_type;
        supplier.company_name = company_name;
        supplier.representative = representative;
        supplier.phone_number = phone_number;
        supplier.email = email;
        supplier.country = country;
        supplier.city = city;
        supplier.area = area;
        supplier.street = street;
        supplier.building_number = building_number;
        supplier.company = company;
        await supplierRepository.save(supplier);
        return supplier;
    } catch (error) {
        // Handle the error
        console.error("Error Creating Supplier:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const supplierRepository = getRepository(Supplier);
        const supplier = await supplierRepository
            .createQueryBuilder("supplier")
            .where("supplier.id = :id", { id: id })
            .getOne();
        return supplier;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Supplier:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const supplierRepository = getRepository(Supplier);
        const supplier = await supplierRepository
            .createQueryBuilder("supplier")
            .where("supplier.companyId = :companyId", { companyId: companyId })
            .orderBy("supplier.createdAt", "DESC")
            .getMany();
        return supplier;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Suppliers:", error);
        return;
    }
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

