import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm } from '@/context/FormContext';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const FormNavigator: React.FC = () => {
  const { currentPage, totalPages, nextPage, prevPage, generatePDF, formData } = useForm();

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;
  const isLastPage = currentPage === totalPages;

  // No validation checks needed
  
  // Don't show navigator on page 17 - it has its own send button
  if (isLastPage) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 border border-form-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={prevPage}
          disabled={!canGoPrev}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Page Indicator */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          {/* Progress Bar */}
          <div className="w-32 sm:w-48 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentPage / totalPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Next Button */}
        <Button
          onClick={nextPage}
          disabled={!canGoNext}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default FormNavigator;