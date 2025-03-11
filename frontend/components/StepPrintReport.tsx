'use client';

import { Typography, Card, CardContent } from '@mui/material';

interface StepPrintReportProps {
    reportData: {
        diagnose: boolean; // Indicates whether diabetes is detected (true) or not (false)
        confidence: number; // The confidence level of the diagnosis (range: 0 to 1)
        id: number; // Unique identifier for the report
    };
}

export default function StepPrintReport({ reportData }: StepPrintReportProps) {
    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, boxShadow: 3 }}>
            <CardContent>
                {/* Title for the report */}
                <Typography variant="h4" component="h2" gutterBottom>
                    Diagnose Report
                </Typography>

                {/* Displaying the unique report ID */}
                <Typography variant="body1" gutterBottom>
                    Report ID: {reportData.id}
                </Typography>

                {/* Displaying diagnosis result with color indication (red for detected, green for not detected) */}
                <Typography
                    variant="body1"
                    color={reportData.diagnose ? 'error' : 'success'}
                    gutterBottom
                >
                    {reportData.diagnose ? 'mtmDR Detected' : 'No mtmDR Detected'}
                </Typography>

                {/* Displaying the confidence level of the diagnosis in percentage format */}
                <Typography variant="body2" color="textSecondary">
                    Confidence: {(reportData.confidence * 100).toFixed(2)}%
                </Typography>
            </CardContent>
        </Card>
    );
}
