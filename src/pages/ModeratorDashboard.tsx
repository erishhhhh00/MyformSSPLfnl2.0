import { FormProvider } from '@/context/FormContext';
import { SubmissionProvider } from '@/context/SubmissionContext';
import ModeratorDashboard from '@/components/ModeratorDashboard';

const ModeratorDashboardPage = () => {
  return (
    <FormProvider>
      <SubmissionProvider>
        <ModeratorDashboard />
      </SubmissionProvider>
    </FormProvider>
  );
};

export default ModeratorDashboardPage;

