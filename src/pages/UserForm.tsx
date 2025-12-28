import { FormProvider } from '@/context/FormContext';
import { SubmissionProvider } from '@/context/SubmissionContext';
import FormContainer from '@/components/FormContainer';
import { useParams } from 'react-router-dom';
import { initialFormData } from '@/data/initialFormData';

const UserForm = () => {
  const { uid } = useParams();
  const prefilledData = uid ? { ...initialFormData, page1: { ...initialFormData.page1, uid } } : initialFormData;
  return (
    <FormProvider initialData={prefilledData}>
      <SubmissionProvider>
        <FormContainer userMode={true} />
      </SubmissionProvider>
    </FormProvider>
  );
};

export default UserForm;