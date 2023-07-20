export enum TransactionType {
	DEBIT = "debit",
	CREDIT = "credit",
}

export enum TransactionSubType {
	OPENING_BALANCE = "opening_balance",
	FUND_TRANSFER = "fund_transfer",
	DEPOSIT = "deposit",
}


export enum StatusType {
	CLOSE = "close",
	OPEN = "open",
}

export enum NyType {
	NO = "N",
	YES = "Y"
}

export enum ExtraForType {
	TAILORING = "tailoring_pack",
}

export enum FuncType {
	FUNCTION = "function",
	AGGREGATE = "aggregate"
}

export enum SchemeType {
	BLANK = "blank",
	YEAR = "year"
}

export enum Role {
	// this is only for businesses owners
	Owner = 'owner',
	// this is only for businesses admins
	Admin = 'admin',
	// this is only for businesses Associates
	Associate = 'associate',
}

