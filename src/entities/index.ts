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

// JoiningTables
import { UserDepartment } from "./joiningTables/UserDepartment";
import { UserProject } from "./joiningTables/UserProject";

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
	Permission
	// UserDepartment,
];
