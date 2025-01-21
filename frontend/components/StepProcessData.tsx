'use client';

import React from 'react';

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
}

export default function StepProcessData({ formData, capturedPhoto }: StepProcessDataProps) {
    return (
        <div>
            <h1>StepProcessData</h1>
        </div>
    );
}
