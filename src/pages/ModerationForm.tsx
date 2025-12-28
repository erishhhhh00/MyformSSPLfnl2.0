import { ModerationFormProvider } from '@/context/ModerationFormContext';
import ModerationFormContainer from '@/components/ModerationFormContainer';
import { useParams } from 'react-router-dom';

const ModerationForm = () => {
  const { uid } = useParams();
  // Wrap provider and pass UID via context using a prop-less approach: we can store uid in container state.
  return (
    <ModerationFormProvider>
      <ModerationFormContainer uid={uid ?? ''} />
    </ModerationFormProvider>
  );
};

export default ModerationForm;
