import { Organization } from "./organization"

// Types
export type User = {
  id: string
  email: string
  name: string
  role?: string
  organizations?: Organization[]
  jobTitle: string
  photo?: string
}