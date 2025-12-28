import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData, FormContextType } from '@/types/form';
import { useToast } from '@/hooks/use-toast';
import { initialFormData } from '@/data/initialFormData';
import { generateFormPDF } from '@/utils/pdfGenerator';

export const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
  initialData?: FormData;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children, initialData }) => {
  const [formData, setFormData] = useState<FormData>(initialData || initialFormData);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 17;
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

  const generatePDF = async (customFormData?: FormData) => {
    const dataToUse = customFormData || formData;
    await generateFormPDF(dataToUse, toast);
  };

  return (
    <FormContext.Provider value={{
      formData,
      currentPage,
      totalPages,
      updateFormData,
      nextPage,
      prevPage,
      generatePDF,
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};