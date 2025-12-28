import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModerationFormProvider, useModerationForm } from '../context/ModerationFormContext';
import ModerationPage1 from '../components/ModerationPage1';
import ModerationPage2 from '../components/ModerationPage2';
import ModerationPage3 from '../components/ModerationPage3';
import ModerationPage4 from '../components/ModerationPage4';
import ModerationPage5 from '../components/ModerationPage5';
import ModerationPage6 from '../components/ModerationPage6';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { API_BASE } from '../lib/api';
import { Loader2, Printer } from 'lucide-react';
import { generateModerationPDF } from '../utils/moderationPdfGenerator';
import { useToast } from '../hooks/use-toast';

const pages = [
    { component: ModerationPage1, title: 'Cover Page' },
    { component: ModerationPage2, title: 'Moderator & Assessor Details' },
    { component: ModerationPage3, title: 'Quality of Assessment Review' },
    { component: ModerationPage4, title: 'Moderation Findings' },
    { component: ModerationPage5, title: 'Summary of Moderation' },
    { component: ModerationPage6, title: 'Feedback & Review Report' },
];

// Inner component that uses the moderation form context
const ReviewContent: React.FC<{
    uid: string;
    formData: any;
}> = ({ uid, formData }) => {
    const { toast } = useToast();

    // Use the moderation PDF generator
    const handleDownloadPdf = async () => {
        try {
            await generateModerationPDF(formData, toast);
        } catch (error) {
            console.error('PDF generation failed:', error);
            toast({
                title: "PDF Generation Failed",
                description: "Could not generate PDF. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Moderation Plan Review</CardTitle>
                    <div className="text-center text-gray-600">
                        <p><strong>UID:</strong> {uid}</p>
                        <p><strong>Moderator:</strong> {formData?.moderationPage2?.moderatorName || 'N/A'}</p>
                        <p><strong>Assessor:</strong> {formData?.moderationPage2?.assessorName || 'N/A'}</p>
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

            <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" onClick={handleDownloadPdf}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print / Save as PDF
                </Button>
                <Button variant="outline" onClick={() => window.close()}>Close</Button>
            </div>
        </div>
    );
};

const ModerationReviewPage: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModeration = async () => {
            if (!uid) return;
            try {
                console.log('Fetching moderation:', uid);
                const response = await fetch(`${API_BASE}/api/moderation/${uid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch moderation data');
                }
                const data = await response.json();
                console.log('Received moderation data:', data);
                setFormData(data.form_data);
            } catch (error) {
                console.error('Error fetching moderation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModeration();
    }, [uid]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!formData) {
        return <div className="text-center py-10">Moderation data not found.</div>;
    }

    return (
        <ModerationFormProvider initialData={formData}>
            <ReviewContent uid={uid!} formData={formData} />
        </ModerationFormProvider>
    );
};

export default ModerationReviewPage;
