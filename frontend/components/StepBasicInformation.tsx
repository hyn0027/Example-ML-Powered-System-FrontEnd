'use client';

import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// Define the props for the StepBasicInformation component
interface StepBasicInformationProps {
    formData: {
        cameraType: string; // Type of camera used for capturing images
        customCameraType: string; // Custom camera type input if "Other" is selected
        age: string; // Age of the user
        gender: string; // Gender of the user
        diabetesHistory: string; // User's history of diabetes diagnosis
        familyDiabetesHistory: string; // Family history of diabetes
        weight: string; // Weight of the user in kilograms
        height: string; // Height of the user in centimeters
    };
    setFormData: (data: StepBasicInformationProps['formData']) => void; // Function to update form data
}

export default function StepBasicInformation({ formData, setFormData }: StepBasicInformationProps) {
    // Define the type for change event
    interface ChangeEvent {
        target: {
            name: string; // Name of the form field
            value: string; // Value entered by the user
        };
    }

    // Handle input change for all fields
    const handleChange = (e: ChangeEvent) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Box sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
            {/* Camera Type Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="camera-type-label">Camera Type</InputLabel>
                <Select
                    labelId="camera-type-label"
                    name="cameraType"
                    value={formData.cameraType}
                    onChange={handleChange}
                >
                    <MenuItem value="Topcon NW400">Topcon NW400</MenuItem>
                    <MenuItem value="Canon CX-1">Canon CX-1</MenuItem>
                    <MenuItem value="Optos Daytona Plus">Optos Daytona Plus</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
            </FormControl>

            {/* Show custom camera type input if 'Other' is selected */}
            {formData.cameraType === 'Other' && (
                <TextField
                    label="Custom Camera Type"
                    name="customCameraType"
                    value={formData.customCameraType}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            )}

            {/* Age Input */}
            <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) {
                        input.value = '';
                    }
                }}
                fullWidth
                margin="normal"
            />

            {/* Gender Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Biological Gender</InputLabel>
                <Select
                    labelId="gender-label"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Non-binary">Non-binary</MenuItem>
                </Select>
            </FormControl>

            {/* Diabetes Diagnosis History Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="diabetes-history-label">Diabetes Diagnosis History</InputLabel>
                <Select
                    labelId="diabetes-history-label"
                    name="diabetesHistory"
                    value={formData.diabetesHistory}
                    onChange={handleChange}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
            </FormControl>

            {/* Family Diabetes History Dropdown */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="family-diabetes-history-label">Family Diabetes History</InputLabel>
                <Select
                    labelId="family-diabetes-history-label"
                    name="familyDiabetesHistory"
                    value={formData.familyDiabetesHistory}
                    onChange={handleChange}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
            </FormControl>

            {/* Weight Input */}
            <TextField
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) {
                        input.value = '';
                    }
                }}
                fullWidth
                margin="normal"
            />

            {/* Height Input */}
            <TextField
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) {
                        input.value = '';
                    }
                }}
                fullWidth
                margin="normal"
            />
        </Box>
    );
}
