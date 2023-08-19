import { Company } from "./Company";
import { Project } from "./Project";
import { User } from "./User";

import { Customer } from "./Customer";
import { Supplier } from "./Supplier";

import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";

import { Department } from "./Department";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { Notification } from './Notification'
import { Attendance } from './Attendance'
import { RequestWorkFlow } from './RequestWorkFlow'
import { SiteRequest } from './SiteRequest'
import { MaterialRequest } from './MaterialRequest'
import { PettyCashRequest } from './PettyCashRequest'

export const entities = [
	User,
	Department,
	Role,
	Project,
	Supplier,
	Customer,
	Inventory,
	InventoryItem,
	Company,
	Permission,
	Notification,
	Attendance,
	RequestWorkFlow,
	SiteRequest,
	MaterialRequest,
	PettyCashRequest,
	// UserDepartment,
];
