import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData } from '@/types/form';

export type SubmissionStatus = 'draft' | 'pending_review' | 'approved';

interface SubmissionContextType {
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: (status: SubmissionStatus) => void;
  submittedFormData: FormData | null;
  setSubmittedFormData: (data: FormData) => void;
  isPendingReview: boolean;
  isApproved: boolean;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export const SubmissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(null);

  return (
    <SubmissionContext.Provider value={{
      submissionStatus,
      setSubmissionStatus,
      submittedFormData,
      setSubmittedFormData,
      isPendingReview: submissionStatus === 'pending_review',
      isApproved: submissionStatus === 'approved'
    }}>
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmission must be used within a SubmissionProvider');
  }
  return context;
};