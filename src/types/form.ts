export interface FormData {
  applicationId?: string;
  page1: {
    learnerName: string;
    idNumber: string;
    companyName: string;
    date: string;
    uid: string;
    assessorName: string;
    assessorIdNumber: string;
    moderatorName: string;
    moderatorIdNumber: string;
    originalIdCopy: boolean;
    digitalIdPhoto: boolean;
    medicalCertificate: boolean;
  };
  page2: {
    name: string;
    dateOfBirth: string;
    gender: string;
    govtId: string;
    designation: string;
    employeeId: string;
    phoneNumber: string;
    email: string;
    emergencyContactPhone: string;
    emergencyContactEmail: string;
    emergencyContactRelationship: string;
    employerName: string;
    employerTelNumber: string;
    courseDetails: string;
    firstAttempt: boolean;
    secondAttempt: boolean;
    basicNumericLiteracy: 'yes' | 'no' | '';
    basicCommunication: 'yes' | 'no' | '';
    observerWitnessRequired: 'yes' | 'no' | '';
    observerWitnessIdNumber: string;
    observerWitnessName: string;
    observerWitnessPhone: string;
    interpreterRequired: 'yes' | 'no' | '';
    interpreterIdNumber: string;
    interpreterName: string;
    interpreterPhone: string;
    additionalRequirements: string;
    learnerSignature: string;
    assessorSignature: string;
    learnerSignatureImage?: string;
    assessorSignatureImage?: string;
  };
  page3: {
    knowledgeWritten: boolean;
    knowledgeOtherSpecify: string;
    knowledgeOtherTick: boolean;
    practicalApplication: boolean;
    practicalOthersSpecify: string;
    practicalOthersTick: boolean;
    externalSourceReferred: string;
    learnerSignaturePage3: string;
    assessorFacilitatorSignature: string;
  };
  page4: {
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page5: {
    outcome1: boolean;
    outcome2: boolean;
    outcome3: boolean;
    outcome4: boolean;
    outcome5: boolean;
    outcome6: boolean;
    outcome7: boolean;
    outcome8: boolean;
    outcome9: boolean;
    outcome10: boolean;
    facilitatorRecommendation: 'yes' | 'no' | '';
    facilitatorSignature: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page6: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
    question6: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page7: {
    question7: string;
    question8: string;
    question9: string;
    question10: string;
    question11: string;
    question12: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page8: {
    question13: string;
    question14: string;
    question15: string;
    question16: string;
    question17: string;
    question18: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page9: {
    question19: string;
    question20: string;
    question21: string;
    question22: string;
    question23: string;
    question24: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page10: {
    question25: string;
    question26: string;
    question27: string;
    question28: string;
    question29: string;
    question30: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page11: {
    question31: string;
    question32: any[];
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page12: {
    question33: string;
    question34: string;
    inspectedBy: string;
    inspectionDate: string;
    slingInspection: any[];
    safetyHarnessInspection: any[];
    safetyHelmetInspection: any[];
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page13: {
    safetyRopesInspection: any[];
    shockAbsorberInspection: any[];
    connectorInspection: any[];
    doubleLockingInspection: any[];
    fallArrestDeviceInspection: any[];
    workPositioningInspection: any[];
    task2Results: any[];
    task3Results: any[];
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page14: {
    shockAbsorbingLanyards: any[];
    workPositioningSystem: any[];
    fallArrestSystem: any[];
    safeMovementStructures: any[];
    task4Results: any[];
    task5Results: any[];
    task6Results: any[];
    fallArrestPracticalResult: 'achieved' | 'not-achieved' | '';
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page15: {
    workplaceInstructions: string;
    observationOneHour: 'yes' | 'no' | '';
    observationDate: string;
    observationPlace: string;
    observationJobDescription: string;
    supervisorName: string;
    supervisorId: string;
    supervisorContact: string;
    supervisorSignature: string;
    timeManagement: '1' | '2' | '3' | '4' | '';
    trainingStandard: '1' | '2' | '3' | '4' | '';
    equipmentImpression: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page16: {
    knowledgeUseful: '1' | '2' | '3' | '4' | '';
    satisfiedProcedure: '1' | '2' | '3' | '4' | '';
    accurateFeedback: '1' | '2' | '3' | '4' | '';
    satisfiedAssessor: '1' | '2' | '3' | '4' | '';
    beforeAssessment: any[];
    duringAfterAssessment: any[];
    learnerComments: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  page17: {
    specificOutcomes: any[];
    knowledgeResults: 'achieved' | 'not-achieved' | '';
    observationResults: 'achieved' | 'not-achieved' | '';
    assessmentResult: 'competent' | 'not-competent' | '';
    assessmentDate: string;
    summativeResults: 'completed' | 'not-completed' | '';
    summativeDate: string;
    moderationDate: string;
    moderatorName: string;
    moderatorSignature: string;
    learnerSignature: string;
    assessorFacilitatorSignature: string;
  };
  [key: string]: any;
}

export interface FormContextType {
  formData: FormData;
  currentPage: number;
  totalPages: number;
  updateFormData: (page: string, data: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  generatePDF: (customFormData?: FormData) => void;
}