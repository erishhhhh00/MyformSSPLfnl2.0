import { FormProvider } from '@/context/FormContext';
import { SubmissionProvider } from '@/context/SubmissionContext';
import AdminDashboard from '@/components/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <FormProvider>
      <SubmissionProvider>
        <AdminDashboard />
      </SubmissionProvider>
    </FormProvider>
  );
};

export default AdminDashboardPage;