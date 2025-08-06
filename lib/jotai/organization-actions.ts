import { ActionOptions } from "./action-options";
import { authStateAtom } from "./atoms/authState";
import { atom } from "jotai";
import { api } from "@/utils/api";
import { User } from "./atoms/user";
import { Organization } from "./atoms/organization";

export const userOrganizationsAtom = atom<Organization[]>([]);
export const organizationsLoadingAtom = atom<boolean>(false);
export const organizationsErrorAtom = atom<string | null>(null);
export const selectedOrganizationAtom = atom<Organization | null>(null);

export const allOrganizationsAtom = atom<Organization[]>([]);
export const allOrganizationsLoadingAtom = atom<boolean>(false);
export const allOrganizationsErrorAtom = atom<string | null>(null);

export const createOrganizationAtom = atom(
  null,
  async (get, set, { name, sphere, options }: { name: string; sphere:string; options?: ActionOptions }) => {
    const authState = get(authStateAtom);
    if (!authState.isAuthenticated) {
      throw new Error("User must be authenticated to create an organization");
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const response = await api.post("/organizations", { name, sphere});
      if (response.status === 201) {
        const newOrganization = response.data;
        const updatedUser = {
          ...authState.user,
          organizations: Array.isArray(authState.user?.organizations)
            ? [...authState.user.organizations, newOrganization]
            : [newOrganization],
        };
        //const updatedUser = { ...authState.user, organizations: { ...authState.user?.organizations , newOrganization} };
        set(authStateAtom, { ...authState, user: updatedUser, isLoading: false, error: null });
        options?.onSuccess?.(newOrganization);
      } else {
        throw new Error("Failed to create organization");
      }
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.message || "Error creating organization";
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const updateOrganizationAtom = atom(
  null,
  async (
    get,
    set,
    { id, name, userIds, options }: { id: string; name?: string; userIds?: string[]; options?: ActionOptions }
  ) => {
    const authState = get(authStateAtom);
    if (!authState.isAuthenticated) {
      throw new Error("User must be authenticated to update an organization");
    }
    if (!authState.user?.organizations?.find((org) => org.founderId === authState.user?.id)) {
      throw new Error("Only the founder can update the organization.");
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const updateData: { name?: string; userIds?: string[] } = {};
      if (name) updateData.name = name;
      if (userIds && userIds.length > 0) {
        updateData.userIds = userIds;
      }else{
        updateData.userIds = get(selectedOrganizationAtom)?.users.map(user => user.id);
      }

      const response = await api.patch(`/organizations/${id}`, updateData);
      if (response.status === 200) {
        const updatedOrganization = response.data;
        
        const updatedUser = {
          ...authState.user,
          organizations: authState.user?.organizations?.map((org) =>
            org.id === id ? updatedOrganization : org
          ),
        };
        set(authStateAtom, { ...authState, user: updatedUser, isLoading: false, error: null });
        
        options?.onSuccess?.(updatedOrganization);
      } else {
        throw new Error("Failed to update organization");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error updating organization";
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const removeOrganizationAtom = atom(
  null,
  async (get, set, { id, options }: { id: string; options?: ActionOptions }) => {
    const authState = get(authStateAtom);
    const userOrganizations = get(userOrganizationsAtom);

    if (!authState.isAuthenticated || !authState.user?.id) {
      const error = new Error('User must be authenticated to remove an organization');
      set(organizationsErrorAtom, error.message);
      options?.onError?.(error);
      return;
    }

    // Check if the user is the founder of the organization
    const organization = userOrganizations.find((org) => org.id === id);
    if (!organization || organization.founderId !== authState.user.id) {
      const error = new Error('Only the founder can remove an organization');
      set(organizationsErrorAtom, error.message);
      options?.onError?.(error);
      return;
    }

    //set(authStateAtom, { ...authState, isLoading: true, error: null });
    set(organizationsLoadingAtom, true);
    set(organizationsErrorAtom, null);

    try {
      const response = await api.delete(`/organizations/${id}`);
      if (response.status === 200) {
        const updatedUser = {
          ...authState.user,
          organizations: authState.user?.organizations?.filter((org) => org.id !== id),
        };
        set(userOrganizationsAtom, userOrganizations.filter((org) => org.id !== id));
        set(organizationsLoadingAtom, false);
        options?.onSuccess?.();
      } else {
        throw new Error("Failed to remove organization");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error removing organization";
      set(organizationsLoadingAtom, false);
      set(organizationsErrorAtom, message);
      options?.onError?.(error);
    }
  }
);

export const fetchUserOrganizationsAtom = atom(
  get => get(userOrganizationsAtom),
  async (get, set) => {
      set(organizationsLoadingAtom, true);
      set(organizationsErrorAtom, null);

      try {
        console.log('Fetching user organizations from frontend...');
        const response = await api.get('/users/organizations');
        set(userOrganizationsAtom, response.data);
      } catch (error: any) {
        console.error('Error fetching organizations:', error.message);
        set(organizationsErrorAtom, error.message || 'Failed to fetch organizations');
      } finally {
        set(organizationsLoadingAtom, false);
      }
  },
);

export const fetchAllOrganizationsAtom = atom(
  get => get(allOrganizationsAtom),
  async (_get, set) => {
    set(allOrganizationsLoadingAtom, true);
    set(allOrganizationsErrorAtom, null);

    try {
      console.log("Fetching all organizations...");
      const response = await api.get("/organizations"); // Ensure this route hits the correct controller
      set(allOrganizationsAtom, response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch all organizations";
      console.error("Error fetching all organizations:", message);
      set(allOrganizationsErrorAtom, message);
    } finally {
      set(allOrganizationsLoadingAtom, false);
    }
  }
);