'use client';

import React from 'react';
import { Box, Typography, Grid2, Card, Divider } from '@mui/material';
import Image from 'next/image';

interface StepTransmitInformationProps {
    formData: {
        cameraType: string; // Type of camera used for capturing the image
        customCameraType: string; // Custom camera type if "Other" is selected
        age: string; // User's age
        gender: string; // User's gender
        diabetesHistory: string; // History of diabetes diagnosis
        familyDiabetesHistory: string; // Family history of diabetes
        weight: string; // User's weight in kilograms
        height: string; // User's height in centimeters
    };
    capturedPhoto: string | null; // Image captured from the camera
}

export default function StepReviewData({ formData, capturedPhoto }: StepTransmitInformationProps) {
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
            {/* Left Side: Basic Information */}
            <Card
                variant="outlined"
                sx={{
                    flex: 1,
                    pt: 2,
                    pb: 2,
                    pl: 4,
                    pr: 4,
                    m: 2,
                    alignSelf: 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Camera Information
                </Typography>
                <Grid2 container spacing={1} sx={{ width: '100%' }}>
                    {/* Camera Type */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Camera Type:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>
                            {formData.cameraType === 'Other'
                                ? `Other (${formData.customCameraType})`
                                : formData.cameraType}
                        </Typography>
                    </Grid2>
                </Grid2>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Patient Information
                </Typography>
                <Grid2 container spacing={1} sx={{ width: '100%' }}>
                    {/* Age */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Age:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.age}</Typography>
                    </Grid2>

                    {/* Gender */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Gender:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.gender}</Typography>
                    </Grid2>

                    {/* Diabetes History */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Diabetes History:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.diabetesHistory}</Typography>
                    </Grid2>

                    {/* Family Diabetes History */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Family Diabetes History:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.familyDiabetesHistory}</Typography>
                    </Grid2>

                    {/* Weight */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Weight:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.weight} ft</Typography>
                    </Grid2>

                    {/* Height */}
                    <Grid2 size={6}>
                        <Typography variant="subtitle1">Height:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography>{formData.height} lb</Typography>
                    </Grid2>
                </Grid2>
            </Card>

            {/* Right Side: Captured Photo */}
            <Card
                variant="outlined"
                sx={{
                    flex: 1,
                    p: 2,
                    m: 2,
                    alignSelf: 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Fundus Photo
                </Typography>
                {capturedPhoto ? (
                    <Image
                        src={capturedPhoto}
                        alt="Captured Photo"
                        layout="intrinsic"
                        width={500}
                        height={400}
                        style={{ borderRadius: '8px', marginBottom: '16px' }}
                    />
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No photo available.
                    </Typography>
                )}
            </Card>
        </Box>
    );
}
