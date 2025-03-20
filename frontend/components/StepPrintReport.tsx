'use client';

import { Typography, Card, CardContent, Divider, Grid, Box } from '@mui/material';
import Image from 'next/image';

interface StepPrintReportProps {
    reportData: {
        diagnose: boolean;
        confidence: number;
        id: number;
    };
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
}

export default function StepPrintReport({
    reportData,
    formData,
    capturedPhoto,
}: StepPrintReportProps) {
    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 6, boxShadow: 5, borderRadius: 3 }}>
            <CardContent>
                {/* Report Header */}
                <Typography variant="h4" component="h2" gutterBottom textAlign="center">
                    Diagnose Report
                </Typography>

                {/* Divider */}
                <Divider sx={{ my: 2 }} />

                {/* Report ID and Result */}
                <Box textAlign="center" mb={3}>
                    <Typography variant="body1" fontWeight="bold">
                        Report ID: {reportData.id}
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={reportData.diagnose ? 'error' : 'success.main'}
                        mt={1}
                    >
                        {reportData.diagnose ? 'mtmDR Detected' : 'No mtmDR Detected'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Confidence Level: {(reportData.confidence * 100).toFixed(2)}%
                    </Typography>
                </Box>

                {/* Camera & Patient Information */}
                <Grid container spacing={2}>
                    {/* Camera Information */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            Camera Information
                        </Typography>
                        <Typography variant="body2">
                            Type: {formData.cameraType}
                            {formData.cameraType === 'Other' && ` (${formData.customCameraType})`}
                        </Typography>
                    </Grid>

                    {/* Patient Information */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            Patient Information
                        </Typography>
                        <Typography variant="body2">Age: {formData.age}</Typography>
                        <Typography variant="body2">Gender: {formData.gender}</Typography>
                        <Typography variant="body2">
                            Diabetes History: {formData.diabetesHistory}
                        </Typography>
                        <Typography variant="body2">
                            Family History: {formData.familyDiabetesHistory}
                        </Typography>
                        <Typography variant="body2">Weight: {formData.weight} lb</Typography>
                        <Typography variant="body2">Height: {formData.height} ft</Typography>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ my: 3 }} />

                {/* Captured Photo */}
                <Typography variant="h6" gutterBottom textAlign="center">
                    Captured Photo
                </Typography>
                {capturedPhoto ? (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Image
                            src={capturedPhoto}
                            alt="Captured Photo"
                            width={500}
                            height={400}
                            style={{
                                borderRadius: '12px',
                                objectFit: 'cover',
                                maxWidth: '100%',
                                height: 'auto',
                            }}
                        />
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        No photo available.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
