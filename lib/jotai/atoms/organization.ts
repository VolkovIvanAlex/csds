import { Report } from "./report";
import { User } from "./user";

export interface Organization {
    id: string;
    name: string;
    founder: User;
    reports: Report[];
    users: User[];
}