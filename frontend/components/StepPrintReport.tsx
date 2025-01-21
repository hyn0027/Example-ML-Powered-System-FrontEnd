'use client';

import { Typography, Card, CardContent } from '@mui/material';

interface StepPrintReportProps {
    reportData: {
        diagnose: boolean;
        confidence: number;
    };
}

export default function StepPrintReport({ reportData }: StepPrintReportProps) {
    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h4" component="h2" gutterBottom>
                    Diabetes Report
                </Typography>
                <Typography
                    variant="body1"
                    color={reportData.diagnose ? 'error' : 'success'}
                    gutterBottom
                >
                    {reportData.diagnose ? 'Diabetes Detected' : 'No Diabetes Detected'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Confidence: {(reportData.confidence * 100).toFixed(2)}%
                </Typography>
            </CardContent>
        </Card>
    );
}
