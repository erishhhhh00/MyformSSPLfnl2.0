import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { API_BASE } from '../lib/api';
import { Loader2, Save, CheckCircle, ArrowLeft, Eye } from 'lucide-react';
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
    onSave: (formData: any) => Promise<void>;
    onMarkReviewed: () => Promise<void>;
    saving: boolean;
}> = ({ uid, studentId, onSave, onMarkReviewed, saving }) => {
    const { toast } = useToast();
    const { formData } = useForm();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const handleSave = async () => {
        try {
            await onSave(formData);
            toast({
                title: "✅ Changes Saved",
                description: "Form data has been updated successfully.",
            });
        } catch (error) {
            console.error('Save failed:', error);
            toast({
                title: "Save Failed",
                description: "Could not save changes. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleMarkReviewed = async () => {
        try {
            await onSave(formData); // Save first
            await onMarkReviewed();
            toast({
                title: "✅ Review Complete",
                description: "Student marked as reviewed. Ready for moderation.",
            });
            navigate('/assessor');
        } catch (error) {
            console.error('Mark reviewed failed:', error);
            toast({
                title: "Action Failed",
                description: "Could not mark as reviewed. Please try again.",
                variant: "destructive"
            });
        }
    };

    const CurrentPageComponent = pages[currentPage - 1]?.component;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/assessor')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Assessor Review</h1>
                            <p className="text-sm text-gray-500">UID: {uid} | Student: {studentId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleSave} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleMarkReviewed}
                            disabled={saving}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Reviewed
                        </Button>
                    </div>
                </div>
            </div>

            {/* Page Navigation */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {pages.map((page, idx) => (
                            <Button
                                key={idx}
                                variant={currentPage === idx + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(idx + 1)}
                                className={currentPage === idx + 1 ? "bg-blue-600" : ""}
                            >
                                Page {idx + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="container mx-auto p-6">
                <Card className="mb-6">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Page {currentPage}: {pages[currentPage - 1]?.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            You can edit any field below. Changes will be saved when you click "Save Changes".
                        </p>
                    </CardHeader>
                    <CardContent className="p-6">
                        {CurrentPageComponent && <CurrentPageComponent />}
                    </CardContent>
                </Card>

                {/* Page Navigation Footer */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous Page
                    </Button>
                    <span className="text-gray-600">
                        Page {currentPage} of {pages.length}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
                        disabled={currentPage === pages.length}
                    >
                        Next Page →
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AssessorReviewPage: React.FC = () => {
    const { uid, studentId } = useParams<{ uid: string; studentId: string }>();
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!uid || !studentId) return;
            try {
                const response = await fetch(`${API_BASE}/api/student/${uid}/${studentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch submission data');
                }
                const data = await response.json();
                setFormData(data.form_data);
            } catch (error) {
                console.error('Error fetching submission:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [uid, studentId]);

    const handleSave = async (updatedFormData: any) => {
        setSaving(true);
        try {
            const response = await fetch(`${API_BASE}/api/assessor-review/${uid}/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ form_data: updatedFormData })
            });
            if (!response.ok) throw new Error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkReviewed = async () => {
        const response = await fetch(`${API_BASE}/api/assessor-review/${uid}/${studentId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Mark reviewed failed');
    };

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
            <ReviewContent
                uid={uid!}
                studentId={studentId!}
                onSave={handleSave}
                onMarkReviewed={handleMarkReviewed}
                saving={saving}
            />
        </FormProvider>
    );
};

export default AssessorReviewPage;
