import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ModerationFormData {
  moderationPage1: any;
  moderationPage2: any;
  moderationPage3: any;
  moderationPage4: any;
  moderationPage5: any;
  moderationPage6: any;
  [key: string]: any;
}

interface ModerationFormContextType {
  formData: ModerationFormData;
  currentPage: number;
  totalPages: number;
  updateFormData: (page: string, data: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  setCurrentPage: (page: number) => void;
}

const ModerationFormContext = createContext<ModerationFormContextType | undefined>(undefined);

interface ModerationFormProviderProps {
  children: ReactNode;
  initialData?: ModerationFormData;
}

const initialModerationFormData: ModerationFormData = {
  moderationPage1: {},
  moderationPage2: {},
  moderationPage3: {},
  moderationPage4: {},
  moderationPage5: {},
  moderationPage6: {}
};

export const ModerationFormProvider: React.FC<ModerationFormProviderProps> = ({ children, initialData }) => {
  const [formData, setFormData] = useState<ModerationFormData>(initialData || initialModerationFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;
  const { toast } = useToast();

  const updateFormData = (page: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [page]: { ...prev[page], ...data }
    }));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      toast({
        title: "Progress Saved",
        description: `Moved to page ${currentPage + 1} of ${totalPages}`,
        duration: 1500,
      });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <ModerationFormContext.Provider value={{
      formData,
      currentPage,
      totalPages,
      updateFormData,
      nextPage,
      prevPage,
      setCurrentPage
    }}>
      {children}
    </ModerationFormContext.Provider>
  );
};

export const useModerationForm = () => {
  const context = useContext(ModerationFormContext);
  if (context === undefined) {
    throw new Error('useModerationForm must be used within a ModerationFormProvider');
  }
  return context;
};
