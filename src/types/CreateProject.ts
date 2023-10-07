import { Customer } from "../entities/Customer";
import { Group } from "../entities/Group";
import { User } from "../entities/User";

interface Comment {
    id: string;
    comment: string;
    userId: string;
    name: string;
    createdAt: string;
}

export type CreateProjectInfo = {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    bid_value: number;
    duration: number;
    project_status: string;
    delivery_date: string;
    contract_number: string;
    project_managers: User[];
    contract_date: string;
    po_budget: number;
    pc_budget: number;
    subcontractor_budget: number;
    staff_budget: number;
    total_budget: number;
    sites_count: number;
    buildings_count: number;
    floors_count: number;
    members?: User[];
    thumbnail?: string;
    customerId?: string;
    comments?: Comment[];
};

export type UpdateProjectInfo = {
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    bid_value: string;
    duration: number;
    project_status: string;
    delivery_date: string;
    contract_number: string;
    project_manager: string;
    contract_date: string;
    po_budget: string;
    pc_budget: string;
    subcontractor_budget: string;
    staff_budget: string;
    total_budget: string;
    sites_count: string;
    buildings_count: string;
    floors_count: string;
    thumbnail?: string;
    customer: Customer;
    comments?: Comment[];
    group?: Group;
};