'use client';

import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface StepProcessDataProps {
    formData: {
        cameraType: string;
        customCameraType: string;
        age: string;
        gender: string;
        diabetesHistory: string;
        familyDiabetesHistory: string;
        weight: string;
        height: string;
    };
    capturedPhoto: string | null;
    setReportGenerated: (reportGenerated: boolean) => void;
    setReportData: (reportData: { diagnose: boolean; confidence: number }) => void;
}

type StepStatus = 'loading' | 'success' | 'error' | 'suspend';

interface Step {
    id: string;
    label: string;
    status: StepStatus;
}

export default function StepProcessData({
    formData,
    capturedPhoto,
    setReportGenerated,
    setReportData,
}: StepProcessDataProps) {
    const [steps, setSteps] = useState<Step[]>([
        { id: 'basic', label: 'Validating Basic Data', status: 'loading' },
        { id: 'photo', label: 'Checking Photo Quality', status: 'loading' },
        { id: 'diagnose', label: 'Diagnosing Disease', status: 'loading' },
        { id: 'report', label: 'Generating Report', status: 'loading' },
    ]);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/process/');

        socket.onopen = () => {
            console.log('WebSocket connection opened');

            const dataToSend = {
                formData,
                capturedPhoto,
            };

            socket.send(JSON.stringify(dataToSend));
            console.log('Data sent:', dataToSend);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message received:', data);

            setSteps((prevSteps) => {
                let errorOccurred = false;

                return prevSteps.map((step) => {
                    if (errorOccurred) {
                        // Mark subsequent steps as "suspend"
                        return { ...step, status: 'suspend' };
                    }

                    if (step.id === 'basic' && data.message === 'Basic information verified') {
                        return { ...step, status: 'success' };
                    }

                    if (step.id === 'basic' && data.message === 'Invalid basic information') {
                        errorOccurred = true;
                        return { ...step, status: 'error' };
                    }

                    if (step.id === 'photo' && data.message === 'Image data verified') {
                        return { ...step, status: 'success' };
                    }

                    if (step.id === 'photo' && data.message === 'Invalid image data') {
                        errorOccurred = true;
                        return { ...step, status: 'error' };
                    }

                    if (step.id === 'diagnose' && data.message === 'Diagnosis complete') {
                        return { ...step, status: 'success' };
                    }

                    if (step.id === 'report' && data.message === 'Report generated') {
                        return { ...step, status: 'success' };
                    }

                    return step;
                });
            });

            if (
                data.message === 'Invalid basic information' ||
                data.message === 'Invalid image data'
            ) {
                setErrorMsg(data.errorMsg);
                socket.close();
            }

            if (data.message === 'Report generated') {
                setReportGenerated(true);
                setReportData({
                    diagnose: data.report.diagnose,
                    confidence: data.report.confidence,
                });
                socket.close();
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, [formData, capturedPhoto, setReportGenerated, setReportData]);

    return (
        <Box sx={{ p: 2 }}>
            <List>
                {steps.map((step) => (
                    <ListItem
                        key={step.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {step.status === 'loading' && (
                                <CircularProgress size={24} sx={{ mr: 2 }} />
                            )}
                            {step.status === 'success' && (
                                <ListItemIcon>
                                    <CheckCircleIcon color="success" />
                                </ListItemIcon>
                            )}
                            {step.status === 'error' && (
                                <ListItemIcon>
                                    <ErrorIcon color="error" />
                                </ListItemIcon>
                            )}
                            {step.status === 'suspend' && (
                                <ListItemIcon>
                                    <PauseCircleIcon color="disabled" />
                                </ListItemIcon>
                            )}
                            <ListItemText primary={step.label} />
                        </Box>
                        {step.status === 'error' && errorMsg && (
                            <Box sx={{ ml: 4, mt: 1 }}>
                                <ListItemText
                                    primary={`Error: ${errorMsg}`}
                                    sx={{ color: 'red' }}
                                />
                            </Box>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
