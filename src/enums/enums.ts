export enum Status {
	APPROVED = "Approved",
	PENDING = "Pending",
	REJECTED = "Rejected",
}

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


export enum Role {
	SUPERUSER = 'superuser',
	OWNER = 'owner',
	ADMIN = 'admin',
	USER = 'user',
}

export enum CustomerType {
	Company = 'Company',
	Individual = 'Individual',
}

export enum SupplierType {
	Company = 'Company',
	Individual = 'Individual',
}

export enum InventoryType {
	Master = 'master_inventory',
	project = 'project_inventory',
}

export enum DepartmentType {
	Management = 'management',
	Financial = 'financial',
	Procurement = 'procurement',
	Construction = 'construction',
	Marketing = 'marketing',
	Customer_supplier = 'customer_supplier',
	HR = 'hr',
	Tender = 'tender',
	IT = 'it',
}