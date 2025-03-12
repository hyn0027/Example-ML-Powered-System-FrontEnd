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
    stepHistory: { step: number; duration: number }[]; // History of steps
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
        const socket = new WebSocket('ws://172.26.103.84:8000/ws/process/'); // Establish WebSocket connection

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
                let finishOccurred = false;

                return prevSteps.map((step) => {
                    if (errorOccurred) {
                        // After an error, all remaining steps are suspended
                        return { ...step, status: 'suspend' };
                    }

                    // If step already succeeded or failed, keep its status
                    if (step.status === 'success' || step.status === 'error') {
                        return step;
                    }

                    // Determine if this is the step being reported on
                    let updatedStatus: StepStatus = 'suspend';
                    console.log('Step:', step.id);
                    console.log('Data:', data.message);
                    console.log('Finish:', finishOccurred);

                    // Check which step corresponds to incoming message and update status
                    if (step.id === 'basic') {
                        if (data.message === 'Basic information verified') {
                            updatedStatus = 'success';
                            finishOccurred = true;
                        } else if (data.message === 'Invalid basic information') {
                            updatedStatus = 'error';
                            errorOccurred = true;
                        } else {
                            updatedStatus = 'loading'; // still processing
                        }
                    } else if (step.id === 'photo') {
                        if (data.message === 'Image data verified') {
                            updatedStatus = 'success';
                            finishOccurred = true;
                        } else if (data.message === 'Invalid image data') {
                            updatedStatus = 'error';
                            errorOccurred = true;
                        } else if (finishOccurred) {
                            updatedStatus = 'loading'; // allowed to process now
                            finishOccurred = false;
                        }
                    } else if (step.id === 'diagnose') {
                        if (data.message === 'Diagnosis complete') {
                            updatedStatus = 'success';
                            finishOccurred = true;
                        } else if (finishOccurred) {
                            updatedStatus = 'loading'; // allowed to process now
                            finishOccurred = false;
                        }
                    } else if (step.id === 'report') {
                        if (data.message === 'Report generated') {
                            updatedStatus = 'success';
                            finishOccurred = true;
                        } else if (finishOccurred) {
                            updatedStatus = 'loading'; // allowed to process now
                            finishOccurred = false;
                        }
                    }

                    // Apply status change if determined, otherwise suspend
                    return { ...step, status: updatedStatus };
                });
            });

            // If there's an error, store the error message and close the socket connection
            if (
                data.message === 'Invalid basic information' ||
                data.message === 'Invalid image data'
            ) {
                setErrorMsg(data.data);
                socket.close();
            }

            // If report is successfully generated, update state and close socket
            if (data.message === 'Report generated') {
                setReportGenerated(true);
                console.log('Report generated:', data.data);
                setReportData({
                    diagnose: data.data.diagnose,
                    confidence: data.data.confidence,
                    id: data.data.id,
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
