import { Organization } from "./organization";
import { User } from "./user";

export interface Report {
    id: string;
    title: string;
    description: string;
    attachments: string[];
    typeOfThreat: string;
    status: string;
    severity: string;
    submittedAt?: string | null;
    submitted: boolean;
    stix: string;
    blockchainHash?: string | null;
    riskScore?: number | null;
    author: User;
    organization: Organization;
}