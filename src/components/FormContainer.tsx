import React from 'react';
import { useForm } from '@/context/FormContext';
import { useSubmission } from '@/context/SubmissionContext';
import { useAuth } from '@/context/AuthContext';
import FormPage1 from './FormPage1';
import FormPage2 from './FormPage2';
import FormPage3 from './FormPage3';
import FormPage4 from './FormPage4';
import FormPage5 from './FormPage5';
import FormPage6 from './FormPage6';
import FormPage7 from './FormPage7';
import FormPage8 from './FormPage8';
import FormPage9 from './FormPage9';
import FormPage10 from './FormPage10';
import FormPage11 from './FormPage11';
import FormPage12 from './FormPage12';
import FormPage13 from './FormPage13';
import FormPage14 from './FormPage14';
import FormPage15 from './FormPage15';
import FormPage16 from './FormPage16';
import FormPage17 from './FormPage17';
import FormNavigator from './FormNavigator';
import AdminReviewPage from './AdminReviewPage';
import RoleToggle from './RoleToggle';

// Placeholder component for pages 3-16
const PlaceholderPage: React.FC<{ pageNumber: number }> = ({ pageNumber }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 border-2 border-form-border bg-card rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-red-500 text-white px-3 py-1 text-sm font-bold mr-2">MHTA</div>
          <div className="text-2xl font-bold">MediHSE</div>
        </div>
        <div className="text-sm text-muted-foreground">Training Academy LLP</div>
        <div className="text-xl font-bold mt-2">Page {pageNumber} Content</div>
      </div>
      
      <div className="mt-8 p-8 bg-muted rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-4">Page {pageNumber} - Under Development</h3>
        <p className="text-muted-foreground">
          This page is a placeholder. Additional form content will be added here based on your requirements.
        </p>
      </div>
      
      <div className="mt-6 text-center">
        <div className="text-lg font-bold">FALL ARREST & RESCUE MANAGEMENT - ToClf</div>
        <div className="text-sm text-muted-foreground mt-2">Page {pageNumber} of 16 - Version 1.0</div>
      </div>
    </div>
  );
};

interface FormContainerProps {
  userMode?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ userMode = false }) => {
  const { currentPage } = useForm();
  const { isPendingReview, isApproved } = useSubmission();
  const { isAdmin } = useAuth();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return <FormPage1 />;
      case 2:
        return <FormPage2 />;
      case 3:
        return <FormPage3 />;
      case 4:
        return <FormPage4 />;
      case 5:
        return <FormPage5 />;
      case 6:
        return <FormPage6 />;
      case 7:
        return <FormPage7 />;
      case 8:
        return <FormPage8 />;
      case 9:
        return <FormPage9 />;
      case 10:
        return <FormPage10 />;
      case 11:
        return <FormPage11 />;
      case 12:
        return <FormPage12 />;
      case 13:
        return <FormPage13 />;
      case 14:
        return <FormPage14 />;
      case 15:
        return <FormPage15 />;
      case 16:
        return <FormPage16 />;
      case 17:
        return <FormPage17 />;
      default:
        return <PlaceholderPage pageNumber={currentPage} />;
    }
  };

  // In user mode, don't show admin features
  if (userMode) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        {renderCurrentPage()}
        <FormNavigator />
      </div>
    );
  }

  // Admin mode - show admin review page if there's a pending review
  if (isAdmin && isPendingReview) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <AdminReviewPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      <RoleToggle />
      {renderCurrentPage()}
      <FormNavigator />
    </div>
  );
};

export default FormContainer;