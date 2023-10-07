import { CustomerType } from "../enums/enums";

export type CreateSubcontractorInfo = {
    subcontractor_type?: CustomerType;
    company_name?: string;
    vat_on?: number;
    representative?: string;
    phone_number?: string;
    email?: string;
    country?: string;
    city?: string;
    area?: string;
    street?: string;
    building_number?: string;
    postal_code?: number;
};
