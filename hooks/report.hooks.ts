import { useAtom } from 'jotai';
import { createReportAtom, updateReportAtom, removeReportAtom, selectedReportAtom, userOrganizationReportsAtom, fetchUserOrganizationReportsAtom, shareReportAtom, revokeReportAtom, submitReportAtom } from '@/lib/jotai/report-actions';

export const useReport = () => {
  const [, createReport] = useAtom(createReportAtom);
  const [, updateReport] = useAtom(updateReportAtom);
  const [, removeReport] = useAtom(removeReportAtom);
  const [userOrganizationReports , fetchUserOrganizationReports] = useAtom(fetchUserOrganizationReportsAtom);
  const [, setSelectedReport] = useAtom(selectedReportAtom);
  const [, submitReport] = useAtom(submitReportAtom);
  const [, shareReport] = useAtom(shareReportAtom);
  const [, revokeReport] = useAtom(revokeReportAtom);
  
  return {
    createReport,
    updateReport,
    removeReport,
    userOrganizationReports,
    fetchUserOrganizationReports,
    setSelectedReport,
    submitReport,
    shareReport,
    revokeReport
  };
};