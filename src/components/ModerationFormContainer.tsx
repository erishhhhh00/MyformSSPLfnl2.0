import React, { useState, useEffect } from 'react';
import { useModerationForm } from '@/context/ModerationFormContext';
import ModerationPage1 from './ModerationPage1';
import ModerationPage2 from './ModerationPage2';
import ModerationPage3 from './ModerationPage3';
import ModerationPage4 from './ModerationPage4';
import ModerationPage5 from './ModerationPage5';
import ModerationPage6 from './ModerationPage6';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Send, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ModerationFormContainerProps {
  uid?: string;
}

const ModerationFormContainer: React.FC<ModerationFormContainerProps> = ({ uid }) => {
  const { currentPage, totalPages, nextPage, prevPage, formData } = useModerationForm();
  const [saving, setSaving] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  console.log('Current Page:', currentPage);
  console.log('Total Pages:', totalPages);
  if (uid) {
    console.log('Moderation UID:', uid);
  }

  const handleSubmitModeration = async () => {
    // Prevent double submission
    if (saving || hasSubmitted) return;

    if (!uid) {
      alert('No UID provided');
      return;
    }
    setSaving(true);
    try {
      await api.saveModeration(uid, formData);
      setHasSubmitted(true);
      setShowSuccessDialog(true);

      // Replace history to prevent back navigation
      window.history.replaceState(null, '', '/moderation-submitted');

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.replace('/moderator');
      }, 2000);
    } catch (e) {
      console.error('Save failed', e);
      setSaving(false); // Re-enable on error
      alert('Failed to save moderation');
    }
  };

  // Auto-redirect when success dialog is shown
  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        window.location.replace('/moderator');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog]);

  const renderCurrentPage = () => {
    console.log('Rendering page:', currentPage);

    try {
      switch (currentPage) {
        case 1:
          return <ModerationPage1 />;
        case 2:
          return <ModerationPage2 />;
        case 3:
          return <ModerationPage3 />;
        case 4:
          return <ModerationPage4 />;
        case 5:
          return <ModerationPage5 />;
        case 6:
          return <ModerationPage6 />;
        default:
          return <ModerationPage1 />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return <div className="p-8 text-center text-red-600">Error loading page {currentPage}</div>;
    }
  };

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="w-full flex-grow">
        {renderCurrentPage()}
      </div>

      {/* Navigation - pushed to bottom */}
      <Card className="w-full max-w-full mx-auto p-4 border border-form-border mt-auto">
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

      {/* Submit Button on Last Page */}
      {currentPage === totalPages && (
        <div className="text-center mt-4">
          <Button
            onClick={handleSubmitModeration}
            disabled={saving || hasSubmitted}
            size="lg"
            className={`text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg ${saving || hasSubmitted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            <Send className="w-5 h-5 mr-2" />
            {saving ? 'Submitting...' : hasSubmitted ? 'Submitted ✓' : 'Submit Moderation'}
          </Button>
        </div>
      )}

      {/* Success Dialog - Same CSS as FormPage17 Thank You popup */}
      <Dialog open={showSuccessDialog} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl">
          <div className="text-center py-8">
            {/* Animated Check Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-lg animate-pulse">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>

            {/* Thank You Message */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-4">
              Thank You!
            </h2>

            <p className="text-gray-600 text-lg font-semibold mb-2">
              Moderation Submitted Successfully
            </p>

            <p className="text-gray-500 text-base">
              UID: <span className="font-bold text-gray-700">{uid}</span>
            </p>

            <p className="text-gray-400 text-sm mt-2">
              Sent to Admin for final approval.
            </p>

            {/* Auto-redirect countdown */}
            <p className="text-sm text-gray-400 mt-6">
              Redirecting in 2 seconds...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationFormContainer;

