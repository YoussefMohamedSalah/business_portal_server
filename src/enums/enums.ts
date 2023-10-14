// used
export enum Status {
	APPROVED = "Approved",
	PENDING = "Pending",
	REJECTED = "Rejected",
}
// used
export enum RequestType {
	PURCHASE_ORDER = "purchase_order_request",
	PETTY_CASH = "petty_cash_request",
	SITE = "site_request",
	MATERIAL = "material_request",
}

export enum NyType {
	NO = "N",
	YES = "Y"
}

export enum FuncType {
	FUNCTION = "function",
	AGGREGATE = "aggregate"
}
// used
export enum Role {
	SUPERUSER = 'Superuser',
	USER = 'User',
	MANAGER = 'Manager',
	DIRECTOR = 'Director',
}
// used
export enum CustomerType {
	Company = 'Company',
	Individual = 'Individual',
}
// used
export enum SupplierType {
	Company = 'Company',
	Individual = 'Individual',
}
// used
export enum InventoryType {
	MASTER = 'master_inventory',
	PROJECT = 'project_inventory',
}
// used
export enum DepartmentType {
	PROJECTS = 'Projects',
	HR = 'HR',
	FINANCE = 'Finance',
	MARKETING = 'Marketing',
	TENDER = 'Tender',
	PROCUREMENT = 'Procurement',
}

export enum taskType {
	GENERAL_TASK = 'general_task',
	GROUP_TASK = 'group_task', // project 
	INDIVIDUAL_TASK = 'individual_task' // 
}

export enum TaskProgressType {
	ToDo = "ToDo",
	InProgress = "ON PROGRESS",
	NeedReview = "REVIEW",
	Completed = "COMPLETE",
}

export enum TaskPriority {
	LOW = "Low",
	MEDIUM = 'Medium',
	HIGH = 'High',
	CRITICAL = 'Critical'
}

export enum ErrorMessages {
	NaN_ERROR = 'Is Not A Number',
	INVALID_INPUT = 'Invalid Input',
}

export enum GenderEnum {
	MALE = 'Male',
	FEMALE = 'Female',
  };

  export enum RoleEnum {
	SUPERUSER = 'Superuser',
	USER = 'User',
	MANAGER = 'Manager',
	DIRECTOR = 'Director',
  };