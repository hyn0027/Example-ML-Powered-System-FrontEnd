'use client';

import React, { Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import StepBasicInformation from '@/components/StepBasicInformation';
import StepTakePhotos from '@/components/StepTakePhotos';
import StepReviewData from '@/components/StepReviewData';
import StepProcessData from '@/components/StepProcessData';
import StepPrintReport from './StepPrintReport';

// Define the steps of the pipeline along with their respective components
const steps = [
    { label: 'Basic Information', component: StepBasicInformation },
    { label: 'Fundus Photo', component: StepTakePhotos },
    { label: 'Review Data', component: StepReviewData },
    { label: 'Process Data', component: StepProcessData },
    { label: 'Print Report', component: StepPrintReport },
];

export default function Pipeline() {
    const [activeStep, setActiveStep] = useState(0);
    const [history, setHistory] = useState<{ step: number; duration: number }[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [retakeCount, setRetakeCount] = useState<number>(0);

    // State to store form data related to patient information
    const [formData, setFormData] = useState<{
        cameraType: string;
        customCameraType: string;
        age: string;
        gender: string;
        diabetesHistory: string;
        familyDiabetesHistory: string;
        weight: string;
        height: string;
    }>({
        cameraType: '',
        customCameraType: '',
        age: '',
        gender: '',
        diabetesHistory: '',
        familyDiabetesHistory: '',
        weight: '',
        height: '',
    });

    // Function to validate form data before proceeding to the next step
    const isFormDataValid = () => {
        if (formData.cameraType === 'Other' && !formData.customCameraType) return false;

        if (
            !formData.cameraType ||
            !formData.age ||
            !formData.gender ||
            !formData.diabetesHistory ||
            !formData.familyDiabetesHistory ||
            !formData.weight ||
            !formData.height
        )
            return false;

        if (Number(formData.age) < 0 || Number(formData.weight) < 0 || Number(formData.height) < 0)
            return false;

        return true;
    };

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [reportGenerated, setReportGenerated] = useState<boolean>(false);

    // State to store report data
    const [reportData, setReportData] = useState<{
        diagnose: boolean;
        confidence: number;
        id: number;
    }>({
        diagnose: false,
        confidence: 0,
        id: 0,
    });

    // Function to track step history and duration
    const recordStepVisit = (newStep: number) => {
        const currentTime = Date.now();
        const duration = (currentTime - startTime) / 1000; // Time spent on step in seconds

        setHistory((prevHistory) => [...prevHistory, { step: activeStep, duration }]);

        setStartTime(currentTime);
        setActiveStep(newStep);
    };

    // Function to move to the next step
    const handleNext = () => {
        recordStepVisit(activeStep + 1);
    };

    // Function to go back to the previous step
    const handleBack = () => {
        recordStepVisit(activeStep - 1);
    };

    // Function to reset the entire process and clear all states
    const handleReset = () => {
        setHistory([]);
        setStartTime(Date.now());
        setActiveStep(0);
        setFormData({
            cameraType: '',
            customCameraType: '',
            age: '',
            gender: '',
            diabetesHistory: '',
            familyDiabetesHistory: '',
            weight: '',
            height: '',
        });
        setCapturedPhoto(null);
        setReportGenerated(false);
        setReportData({
            diagnose: false,
            confidence: 0,
            id: 0,
        });
    };

    // Function to determine if the current step can be interacted with
    const isOperationalByUser = (step: number) => {
        if (step === 0 && isFormDataValid()) return true;
        if (step === 1 && capturedPhoto) return true;
        if (step === 2) return true;
        if (step === 3 && reportGenerated) return true;
        if (step === 4) return true;
        return false;
    };

    const StepContent = steps[activeStep]?.component;

    return (
        <Box sx={{ width: '100%', p: 6 }}>
            {/* Stepper component to visually indicate progress */}
            <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Suspense fallback={<CircularProgress />}>
                        {StepContent ? (
                            <StepContent
                                formData={formData}
                                setFormData={(data: Partial<typeof formData>) =>
                                    setFormData((prev) => ({ ...prev, ...data }))
                                }
                                capturedPhoto={capturedPhoto}
                                setCapturedPhoto={setCapturedPhoto}
                                setReportGenerated={setReportGenerated}
                                setReportData={setReportData}
                                reportData={reportData}
                                stepHistory={history} // Passing history data to components
                                retakeCount={retakeCount}
                                setRetakeCount={setRetakeCount}
                            />
                        ) : (
                            <Typography>No Content Available</Typography>
                        )}
                    </Suspense>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="primary"
                            disabled={activeStep === 0}
                            variant="contained"
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            disabled={!isOperationalByUser(activeStep)}
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mr: 1 }}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}
