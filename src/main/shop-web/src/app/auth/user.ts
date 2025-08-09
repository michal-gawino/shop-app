import { Role } from "../shared/models/role";

export interface User {
    id: string | null,
    firstName: string;
    lastName: string,
    email: string;
    roles: Role[];
}