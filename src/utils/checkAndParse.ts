import { ErrorMessages } from "../enums/enums";

export const checkAndParse = (item: any) => {
	if (typeof item === 'string') return JSON.parse(item);
	else return item;
}

export const isValidNumber = (value: any): boolean => {
	const numberRegex = /^\d+$/; // Regular expression to check if the string consists of digits only
	return numberRegex.test(value);
};

export const processNumber = (term: string, value: string | number): number | string | undefined => {
	if (typeof value === 'number') {
		return value;
	} else if (typeof value === 'string') {
		const convertedValue = Number(value);
		if (isNaN(convertedValue)) {
			return term + ' ' + ErrorMessages.NaN_ERROR;
		} else if (!isValidNumber(value)) {
			return term + ' ' + ErrorMessages.NaN_ERROR;
		} else {
			return convertedValue;
		}
	} else {
		return 0;
	}
};