'use client';

import React from 'react';
import { Button, Box, Typography, Card } from '@mui/material';
import Image from 'next/image';

interface StepTakePhotosProps {
    capturedPhoto: string | null;
    setCapturedPhoto: (photo: string | null) => void;
}

const getRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000); // Generate a random image ID
    return `https://picsum.photos/500/400?random=${randomId}`; // Get a random image from Lorem Picsum
};

export default function StepTakePhotos({ capturedPhoto, setCapturedPhoto }: StepTakePhotosProps) {
    const capturePhoto = async () => {
        const imageSrc = getRandomImage();
        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedPhoto(reader.result as string); // Store Base64 string
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error capturing photo:', error);
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
                        <Box
                            sx={{
                                width: 500,
                                height: 375, // Maintain aspect ratio (adjust as needed)
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.500',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body1">
                                Camera Placeholder
                                <br />
                                Click Capture Photo to generate a fake image
                            </Typography>
                        </Box>
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
