import { useAtom } from 'jotai';
import { createOrganizationAtom, updateOrganizationAtom, removeOrganizationAtom, fetchUserOrganizationsAtom, selectedOrganizationAtom, fetchAllOrganizationsAtom } from '@/lib/jotai/organization-actions';

export const useOrganization = () => {
  const [, createOrganization] = useAtom(createOrganizationAtom);
  const [, updateOrganization] = useAtom(updateOrganizationAtom);
  const [, removeOrganization] = useAtom(removeOrganizationAtom);
  const [userOrganizations, fetchUserOrganizations] = useAtom(fetchUserOrganizationsAtom);
  const [allOrganizations, fetchAllOrganizations] = useAtom(fetchAllOrganizationsAtom);
  const [, setSelectedOrganization] = useAtom(selectedOrganizationAtom);

  return {
    createOrganization,
    updateOrganization,
    removeOrganization,
    userOrganizations,
    fetchUserOrganizations,
    setSelectedOrganization,
    allOrganizations,
    fetchAllOrganizations
  };
};