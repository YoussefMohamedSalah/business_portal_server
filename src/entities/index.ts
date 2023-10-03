import { Company } from "./Company";
import { Project } from "./Project";
import { User } from "./User";

import { Customer } from "./Customer";
import { Supplier } from "./Supplier";

import { Inventory } from "./Inventory";
import { InventoryItem } from "./InventoryItem";

import { RequestWorkFlow } from './RequestWorkFlow'
import { SiteRequest } from './SiteRequest'
import { MaterialRequest } from './MaterialRequest'
import { PettyCashRequest } from './PettyCashRequest'
import { PurchaseOrderRequest } from "./PurchaseOrderRequest";

import { Department } from "./Department";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { Notification } from './Notification'
import { Attendance } from './Attendance'
import { Task } from "./Task";
import { Group } from "./Group";
import { Tender } from "./Tender";
import {SubcontractorInvoice} from './SubcontractorInvoice';
import {Subcontractor} from './Subcontractor';


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
	PurchaseOrderRequest,
	Task,
	Group,
	Tender,
	SubcontractorInvoice,
	Subcontractor
	// UserDepartment,
];
