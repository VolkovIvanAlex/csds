import { useAtom } from 'jotai';
import { createReportAtom, updateReportAtom, removeReportAtom, selectedReportAtom, userOrganizationReportsAtom, fetchUserOrganizationReportsAtom, shareReportAtom, revokeReportAtom, submitReportAtom, broadcastReportAtom, reportsLoadingAtom, proposeResponseActionAtom, getResponseActionsAtom, removeFromNetworkAtom } from '@/lib/jotai/report-actions';

export const useReport = () => {
  const [, reportsLoading] = useAtom(reportsLoadingAtom);
  const [, createReport] = useAtom(createReportAtom);
  const [, updateReport] = useAtom(updateReportAtom);
  const [, removeReport] = useAtom(removeReportAtom);
  const [userOrganizationReports , fetchUserOrganizationReports] = useAtom(fetchUserOrganizationReportsAtom);
  const [, setSelectedReport] = useAtom(selectedReportAtom);
  const [, submitReport] = useAtom(submitReportAtom);
  const [, shareReport] = useAtom(shareReportAtom);
  const [, revokeReport] = useAtom(revokeReportAtom);
  const [, broadcastReport] = useAtom(broadcastReportAtom);
  const [, removeFromNetwork] = useAtom(removeFromNetworkAtom);
  const [, proposeResponseAction] = useAtom(proposeResponseActionAtom);
  const [, getResponseActions] = useAtom(getResponseActionsAtom);
    
  return {
    reportsLoading,
    createReport,
    updateReport,
    removeReport,
    userOrganizationReports,
    fetchUserOrganizationReports,
    setSelectedReport,
    submitReport,
    shareReport,
    revokeReport,
    broadcastReport,
    removeFromNetwork,
    proposeResponseAction,
    getResponseActions,
  };
};