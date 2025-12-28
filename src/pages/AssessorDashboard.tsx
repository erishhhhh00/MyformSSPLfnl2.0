import { FormProvider } from '@/context/FormContext';
import { SubmissionProvider } from '@/context/SubmissionContext';
import AssessorDashboard from '@/components/AssessorDashboard';

const AssessorDashboardPage = () => {
  return (
    <FormProvider>
      <SubmissionProvider>
        <AssessorDashboard />
      </SubmissionProvider>
    </FormProvider>
  );
};

export default AssessorDashboardPage;

