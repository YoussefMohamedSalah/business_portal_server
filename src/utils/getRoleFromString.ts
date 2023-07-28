import { Role } from "../enums/enums";
type RoleStrings = 'owner' | 'admin' | 'user';

export const getRoleFromString = (roleString: RoleStrings): string => {
    return Role[roleString as keyof typeof Role];
}