import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from '../context/FormContext';
import FormPage1 from '../components/FormPage1';
import FormPage2 from '../components/FormPage2';
import FormPage3 from '../components/FormPage3';
import FormPage4 from '../components/FormPage4';
import FormPage5 from '../components/FormPage5';
import FormPage6 from '../components/FormPage6';
import FormPage7 from '../components/FormPage7';
import FormPage8 from '../components/FormPage8';
import FormPage9 from '../components/FormPage9';
import FormPage10 from '../components/FormPage10';
import FormPage11 from '../components/FormPage11';
import FormPage12 from '../components/FormPage12';
import FormPage13 from '../components/FormPage13';
import FormPage14 from '../components/FormPage14';
import FormPage15 from '../components/FormPage15';
import FormPage16 from '../components/FormPage16';
import FormPage17 from '../components/FormPage17';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { api, API_BASE } from '../lib/api';
import { Loader2, Download, Printer, CheckCircle } from 'lucide-react';
import { generateFormPDF } from '../utils/pdfGenerator';
import { useToast } from '../hooks/use-toast';

const pages = [
  { component: FormPage1, title: 'Personal & Contact Details' },
  { component: FormPage2, title: 'Educational Qualifications' },
  { component: FormPage3, title: 'Past Experience' },
  { component: FormPage4, title: 'Training Program Details' },
  { component: FormPage5, title: 'Training Program Details (Cont.)' },
  { component: FormPage6, title: 'Training Program Details (Cont.)' },
  { component: FormPage7, title: 'Training Program Details (Cont.)' },
  { component: FormPage8, title: 'Training Program Details (Cont.)' },
  { component: FormPage9, title: 'Training Program Details (Cont.)' },
  { component: FormPage10, title: 'Training Program Details (Cont.)' },
  { component: FormPage11, title: 'Training Program Details (Cont.)' },
  { component: FormPage12, title: 'Training Program Details (Cont.)' },
  { component: FormPage13, title: 'Training Program Details (Cont.)' },
  { component: FormPage14, title: 'Training Program Details (Cont.)' },
  { component: FormPage15, title: 'Training Program Details (Cont.)' },
  { component: FormPage16, title: 'Training Program Details (Cont.)' },
  { component: FormPage17, title: 'Declaration' },
];

// Inner component that uses the form context
const ReviewContent: React.FC<{
  uid: string;
  studentId: string;
  formData: any;
  isAssessor?: boolean;
}> = ({ uid, studentId, formData, isAssessor }) => {
  const { toast } = useToast();
  const { generatePDF } = useForm();

  // Use the proper pdfGenerator for structured PDF
  const handleDownloadPdf = async () => {
    try {
      await generatePDF(formData);
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle Mark as Reviewed for Assessor
  const handleMarkAsReviewed = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/assessor-review/${uid}/${studentId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to mark as reviewed');
      toast({
        title: "✅ Review Complete",
        description: "Student marked as reviewed. Ready for moderation.",
      });
      window.close();
    } catch (error) {
      console.error('Mark reviewed failed:', error);
      toast({
        title: "Action Failed",
        description: "Could not mark as reviewed. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isAssessor ? 'Assessor Review' : 'Student Application Review'}
          </CardTitle>
          <div className="text-center text-gray-600">
            <p><strong>UID:</strong> {uid}</p>
            <p><strong>Student ID:</strong> {studentId}</p>
            <p><strong>Learner:</strong> {formData?.page1?.learnerName || 'N/A'}</p>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        {pages.map((page, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{`Page ${index + 1}: ${page.title}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset disabled>
                <page.component />
              </fieldset>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAssessor ? (
        <div className="mt-8 flex justify-center">
          <Button className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg" onClick={handleMarkAsReviewed}>
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark as Reviewed
          </Button>
        </div>
      ) : (
        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Printer className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
          <Button variant="outline" onClick={() => window.close()}>Close</Button>
        </div>
      )}
    </div>
  );
};

const SubmissionReviewPage: React.FC = () => {
  const { uid, studentId } = useParams<{ uid: string; studentId: string }>();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if this is an Assessor review via query param
  const isAssessor = searchParams.get('role') === 'assessor';

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!uid || !studentId) return;
      try {
        console.log('Fetching student:', uid, studentId);
        const response = await fetch(`${API_BASE}/api/student/${uid}/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission data');
        }
        const data = await response.json();
        console.log('Received student data:', data);
        setFormData(data.form_data);
      } catch (error) {
        console.error('Error fetching submission:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [uid, studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!formData) {
    return <div className="text-center py-10">Submission not found.</div>;
  }

  return (
    <FormProvider initialData={formData}>
      <ReviewContent uid={uid!} studentId={studentId!} formData={formData} isAssessor={isAssessor} />
    </FormProvider>
  );
};

export default SubmissionReviewPage;
