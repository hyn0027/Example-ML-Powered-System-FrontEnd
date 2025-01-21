'use client';

import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Typography, Card } from '@mui/material';
import Image from 'next/image';

interface StepTakePhotosProps {
    capturedPhoto: string | null;
    setCapturedPhoto: (photo: string | null) => void;
}

export default function StepTakePhotos({ capturedPhoto, setCapturedPhoto }: StepTakePhotosProps) {
    const webcamRef = useRef<Webcam>(null);

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedPhoto(imageSrc);
        }
    };

    const resetPhoto = () => {
        setCapturedPhoto(null);
    };

    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            sx={{
                mt: 4,
                p: 2,
                margin: 'auto',
                borderRadius: 2,
                backgroundColor: 'background.paper',
            }}
        >
            {/* Left section with instructions */}
            <Card
                variant="outlined"
                sx={{
                    flex: 1,
                    p: 2,
                    mt: 2,
                    alignSelf: 'flex-start',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Instructions
                    </Typography>
                </Box>
                <Typography variant="body1">
                    1. Make sure the camera is focused on the fundus.
                    <br />
                    2. Capture the photo when the fundus is in focus.
                    <br />
                    3. Make sure the photo is clear and not blurry.
                    <br />
                    4. Click on the &quot;Capture Photo&quot; button to take the photo.
                    <br />
                    5. Click on the &quot;Retake Photo&quot; button to retake the photo.
                </Typography>
            </Card>

            {/* Right section with webcam or photo */}
            <Box
                sx={{
                    flex: 2,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 650,
                }}
            >
                {!capturedPhoto ? (
                    <Box>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{ width: 500, borderRadius: 4 }}
                        />
                        <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" color="primary" onClick={capturePhoto}>
                                Capture Photo
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box
                            sx={{
                                width: '100%',
                                height: 'auto',
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={capturedPhoto}
                                alt="Captured photo"
                                layout="intrinsic"
                                width={500}
                                height={400}
                                style={{ borderRadius: 4 }}
                            />
                        </Box>
                        <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" color="primary" onClick={resetPhoto}>
                                Retake Photo
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
