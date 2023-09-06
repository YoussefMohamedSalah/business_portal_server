import { Customer } from "../entities/Customer";
import { Group } from "../entities/Group";
import { Task } from "../entities/Task";
import { User } from "../entities/User";

interface Comment {
    id: string;
    comment: string;
    userId: string;
    name: string;
}

export type CreateProjectInfo = {
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