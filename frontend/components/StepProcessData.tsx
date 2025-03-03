'use client';

import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

interface StepProcessDataProps {
    formData: {
        cameraType: string; // Type of camera used
        customCameraType: string; // Custom camera type if applicable
        age: string; // User's age
        gender: string; // User's gender
        diabetesHistory: string; // User's personal history of diabetes
        familyDiabetesHistory: string; // Family history of diabetes
        weight: string; // User's weight
        height: string; // User's height
    };
    capturedPhoto: string | null; // Captured photo data
    stepHistory: { step: number; timestamp: number; duration: number }[]; // History of steps
    retakeCount: number; // Number of retakes
    setReportGenerated: (reportGenerated: boolean) => void; // Function to update report generation status
    setReportData: (reportData: { diagnose: boolean; confidence: number; id: number }) => void; // Function to update the report data
}

type StepStatus = 'loading' | 'success' | 'error' | 'suspend';

interface Step {
    id: string; // Unique identifier for each step
    label: string; // Step description
    status: StepStatus; // Current status of the step
}

export default function StepProcessData({
    formData,
    capturedPhoto,
    stepHistory,
    retakeCount,
    setReportGenerated,
    setReportData,
}: StepProcessDataProps) {
    const [steps, setSteps] = useState<Step[]>([
        { id: 'basic', label: 'Validating Basic Data', status: 'loading' },
        { id: 'photo', label: 'Checking Photo Quality', status: 'loading' },
        { id: 'diagnose', label: 'Diagnosing Disease', status: 'loading' },
        { id: 'report', label: 'Generating Report', status: 'loading' },
    ]);

    const [errorMsg, setErrorMsg] = useState<string | null>(null); // Stores error message if any step fails

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/process/'); // Establish WebSocket connection

        socket.onopen = () => {
            console.log('WebSocket connection opened');

            // Send form data and captured photo to WebSocket server
            const dataToSend = {
                formData,
                stepHistory,
                retakeCount,
                capturedPhoto,
            };

            socket.send(JSON.stringify(dataToSend));
            console.log('Data sent:', dataToSend);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse incoming WebSocket message
            console.log('Message received:', data);

            setSteps((prevSteps) => {
                let errorOccurred = false;

                return prevSteps.map((step) => {
                    if (errorOccurred) {
                        // If an error has occurred, mark subsequent steps as "suspend"
                        return { ...step, status: 'suspend' };
                    }

                    // Check different step conditions and update status accordingly
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

                    return step; // Keep previous step status if no changes are required
                });
            });

            // If there's an error, store the error message and close the socket connection
            if (
                data.message === 'Invalid basic information' ||
                data.message === 'Invalid image data'
            ) {
                setErrorMsg(data.errorMsg);
                socket.close();
            }

            // If report is successfully generated, update state and close socket
            if (data.message === 'Report generated') {
                setReportGenerated(true);
                setReportData({
                    diagnose: data.report.diagnose,
                    confidence: data.report.confidence,
                    id: data.report.id,
                });
                socket.close();
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed'); // Log WebSocket closure
        };

        socket.onerror = (error) => {
            console.log('WebSocket error:', error); // Handle WebSocket errors
        };

        return () => {
            socket.close(); // Cleanup WebSocket connection on component unmount
        };
    }, [formData, capturedPhoto, stepHistory, retakeCount, setReportGenerated, setReportData]);

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
                            {/* Display appropriate icon based on step status */}
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
                        {/* Display error message if any step fails */}
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
