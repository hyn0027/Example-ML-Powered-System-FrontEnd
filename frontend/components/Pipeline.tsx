'use client';

import React, { lazy, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// const steps = [
//     'Take Photos',
//     'Transmit Photos',
//     'Verify Photos',
//     'Detect Disease',
//     'Generate Report',
// ];

const steps = [
    {
        label: 'Basic Information',
        component: lazy(() => import('@/components/StepBasicInformation')),
    },
    { label: 'Fundus Photo', component: lazy(() => import('@/components/StepTakePhotos')) },
    {
        label: 'Review Data',
        component: lazy(() => import('@/components/StepReviewData')),
    },
    { label: 'Process Data', component: lazy(() => import('@/components/StepProcessData')) },
];

export default function Pipeline() {
    const [activeStep, setActiveStep] = React.useState(0);

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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const isOperationalByUser = (step: number) => {
        if (step === 0 && isFormDataValid()) return true;
        if (step === 1 && capturedPhoto) return true;
        if (step === 2) return true;
        return false;
    };

    const StepContent = steps[activeStep]?.component;

    return (
        <Box sx={{ width: '100%', p: 6 }}>
            <Stepper activeStep={activeStep} sx={{ marginBottom: 4 }}>
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                    <Suspense fallback={<CircularProgress />}>
                        {StepContent ? (
                            <StepContent
                                formData={formData}
                                setFormData={(data: Partial<typeof formData>) =>
                                    setFormData((prev) => ({ ...prev, ...data }))
                                }
                                capturedPhoto={capturedPhoto}
                                setCapturedPhoto={setCapturedPhoto}
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
