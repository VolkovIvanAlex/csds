import { atom } from "jotai";
import { api } from "@/utils/api";
import { authStateAtom } from "./atoms/authState";
import { ActionOptions } from "./action-options";
import { Report } from "./atoms/report";
import { AuthState } from "./atoms/authState";

export const userOrganizationReportsAtom = atom<Report[]>([]);
export const reportsLoadingAtom = atom<boolean>(false);
export const reportsErrorAtom = atom<string | null>(null);
export const selectedReportAtom = atom<Report | null>(null);

export const createReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      organizationId,
      reportData,
      options,
    }: {
      organizationId: string;
      reportData: Omit<Report, "id" | "submittedAt" | "attachments" |"blockchainHash">;
      options?: ActionOptions;
    }
  ) => {
    console.log("reportData = ", reportData);
    const authState = get(authStateAtom) as AuthState;
    if (!authState.isAuthenticated) {
      throw new Error("User must be authenticated to create a report");
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const response = await api.post(`/reports`, reportData);
      if (response.status === 201) {
        const newReport = response.data;
        const updatedOrganizations = authState.user?.organizations?.map((org) =>
          org.id === organizationId
            ? { ...org, reports: [...org.reports, newReport] }
            : org
        );
        const updatedUser = { ...authState.user, organizations: updatedOrganizations };
        set(authStateAtom, { ...authState, user: updatedUser, isLoading: false, error: null });
        options?.onSuccess?.(newReport);
      } else {
        throw new Error("Failed to create report");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error creating report";
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const updateReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      organizationId,
      reportId,
      reportData,
      options,
    }: {
      organizationId: string;
      reportId: string;
      reportData: Partial<Report>;
      options?: ActionOptions;
    }
  ) => {
    const authState = get(authStateAtom) as AuthState;
    if (!authState.isAuthenticated) {
      throw new Error("User must be authenticated to update a report");
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const response = await api.patch(`reports/${reportId}`, reportData);
      if (response.status === 200) {
        const updatedReport = response.data;
        const updatedOrganizations = authState.user?.organizations?.map((org) =>
          org.id === organizationId
            ? {
                ...org,
                reports: org.reports.map((report) =>
                  report.id === reportId ? updatedReport : report
                ),
              }
            : org
        );
        const updatedUser = { ...authState.user, organizations: updatedOrganizations };
        set(authStateAtom, { ...authState, user: updatedUser, isLoading: false, error: null });
        options?.onSuccess?.(updatedReport);
      } else {
        throw new Error("Failed to update report");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error updating report";
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const removeReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      organizationId,
      reportId,
      options,
    }: {
      organizationId: string;
      reportId: string;
      options?: ActionOptions;
    }
  ) => {
    const authState = get(authStateAtom) as AuthState;
    const userOrganizationReports = get(userOrganizationReportsAtom);

    if (!authState.isAuthenticated) {
      throw new Error("User must be authenticated to remove a report");
    }

    set(authStateAtom, { ...authState, isLoading: true, error: null });

    try {
      const response = await api.delete(`/reports/${reportId}`);
      if (response.status === 200) {
        const updatedOrganizations = authState.user?.organizations?.map((org) =>
          org.id === organizationId
            ? { ...org, reports: org.reports.filter((report) => report.id !== reportId) }
            : org
        );
        const updatedUser = { ...authState.user, organizations: updatedOrganizations };
        set(authStateAtom, { ...authState, user: updatedUser, isLoading: false, error: null });
        set(userOrganizationReportsAtom, userOrganizationReports.filter((report) => report.id !== reportId));
        options?.onSuccess?.();
      } else {
        throw new Error("Failed to remove report");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error removing report";
      set(authStateAtom, { ...authState, isLoading: false, error: message });
      options?.onError?.(error);
    }
  }
);

export const fetchUserOrganizationReportsAtom = atom(
  get => get(userOrganizationReportsAtom),
  async (get, set) => {
      set(reportsLoadingAtom, true);
      set(reportsErrorAtom, null);

      try {
        console.log('Fetching user organizations from frontend...');
        const response = await api.get('/reports/user');
        console.log('API Response:', response.data);
        set(userOrganizationReportsAtom, response.data);
      } catch (error: any) {
        console.error('Error fetching organizations:', error.message);
        set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      } finally {
        set(reportsLoadingAtom, false);
      }
  },
);

export const submitReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      options,
    }: {
      reportId: string
      options?: ActionOptions
    }
  ) => {
    const authState = get(authStateAtom) as AuthState
    if (!authState.isAuthenticated) {
      throw new Error('User must be authenticated to submit a report')
    }

    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.post(`/reports/${reportId}/submit`)
      console.log('API Response:', response)
      if (response.status === 201) {
        const updatedReport = response.data
        console.log('Updated report:', updatedReport)
        // Update userOrganizationReports
        const currentReports = get(userOrganizationReportsAtom)
        const updatedReports = currentReports.map((report) =>
          report.id === reportId ? { ...report, ...updatedReport } : report
        )
        set(userOrganizationReportsAtom, updatedReports)
        set(selectedReportAtom, updatedReport)
        set(reportsLoadingAtom, false) // Reset loading state
        options?.onSuccess?.()
      } else {
        throw new Error('Failed to submit report')
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error submitting report'
      set(authStateAtom, { ...authState, isLoading: false, error: message })
      set(reportsErrorAtom, message)
      set(reportsLoadingAtom, false) // Reset loading state on error
      options?.onError?.(message)
    }
  }
)

export const shareReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      sourceOrgId,
      targetOrgId,
      options,
    }: {
      reportId: string;
      sourceOrgId: string;
      targetOrgId: string;
      options?: ActionOptions;
    }
  ) => {
    
    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.post(`/reports/${reportId}/${sourceOrgId}/share/${targetOrgId}`);
      console.log('API Response:', response)
      const updatedReport = response.data
      console.log('Updated report:', updatedReport)
      // Update userOrganizationReports
      const currentReports = get(userOrganizationReportsAtom)
      const updatedReports = currentReports.map((report) =>
        report.id === reportId ? { ...report, ...updatedReport } : report
      )
      set(userOrganizationReportsAtom, updatedReports)
      set(selectedReportAtom, updatedReport)
      options?.onSuccess?.()
    } catch (error: any) {
      console.error('Error sharing report with organization:', error.message);
      set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      options?.onError?.(error);
    } finally {
      set(reportsLoadingAtom, false);
    }
  }
);

export const revokeReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      sourceOrgId,
      targetOrgId,
      options,
    }: {
      reportId: string;
      sourceOrgId: string;
      targetOrgId: string;
      options?: ActionOptions;
    }
  ) => {
    
    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.post(`/reports/${reportId}/${sourceOrgId}/revoke/${targetOrgId}`);
      console.log('API Response:', response)
      const updatedReport = response.data
      console.log('Updated report:', updatedReport)
      // Update userOrganizationReports
      const currentReports = get(userOrganizationReportsAtom)
      const updatedReports = currentReports.map((report) =>
        report.id === reportId ? { ...report, ...updatedReport } : report
      )
      set(userOrganizationReportsAtom, updatedReports)
      set(selectedReportAtom, updatedReport)
      options?.onSuccess?.()
    } catch (error: any) {
      console.error('Error sharing report with organization:', error.message);
      set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      options?.onError?.(error);
    } finally {
      set(reportsLoadingAtom, false);
    }
  }
);

export const broadcastReportAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      options,
    }: {
      reportId: string;
      options?: ActionOptions;
    }
  ) => {
    
    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.post(`/reports/${reportId}/broadcast`);
      console.log('API Response:', response)
      options?.onSuccess?.()
    } catch (error: any) {
      console.error('Error sharing report with organization:', error.message);
      set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      options?.onError?.(error);
    } finally {
      set(reportsLoadingAtom, false);
    }
  }
);

export const proposeResponseActionAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      description,
      options,
    }: {
      reportId: string;
      description: string;
      options?: ActionOptions;
    }
  ) => {
    
    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.post(`/reports/${reportId}/response-actions`, {description});
      console.log('API Response:', response)
      options?.onSuccess?.()
    } catch (error: any) {
      console.error('Error sharing report with organization:', error.message);
      set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      options?.onError?.(error);
    } finally {
      set(reportsLoadingAtom, false);
    }
  }
);

export const getResponseActionsAtom = atom(
  null,
  async (
    get,
    set,
    {
      reportId,
      options,
    }: {
      reportId: string;
      options?: ActionOptions;
    }
  ) => {
    
    try {
      set(reportsLoadingAtom, true) // Set loading state to true
      const response = await api.get(`/reports/${reportId}/response-actions`);
      console.log('API Response:', response)
      options?.onSuccess?.(response.data)
    } catch (error: any) {
      console.error('Error sharing report with organization:', error.message);
      set(reportsErrorAtom, error.message || 'Failed to fetch organizations');
      options?.onError?.(error);
    } finally {
      set(reportsLoadingAtom, false);
    }
  }
);
