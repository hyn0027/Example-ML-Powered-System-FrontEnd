'use client';

import React from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Divider,
} from '@mui/material';

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
        <Box
            sx={{
                padding: 3,
                maxWidth: 600,
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {/* Section: Camera Information */}
            <Typography variant="h6" gutterBottom>
                Camera Information
            </Typography>

            {/* Camera Type Dropdown */}
            <FormControl fullWidth>
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

            {/* Custom Camera Type if 'Other' is selected */}
            {formData.cameraType === 'Other' && (
                <TextField
                    label="Custom Camera Type"
                    name="customCameraType"
                    value={formData.customCameraType}
                    onChange={(e) => handleChange(e)}
                    fullWidth
                />
            )}

            <Divider sx={{ marginY: 3 }} />

            {/* Section: User Information */}
            <Typography variant="h6" gutterBottom>
                Patient Information
            </Typography>

            {/* Age */}
            <TextField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange(e)}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) input.value = '';
                }}
                fullWidth
            />

            {/* Gender */}
            <FormControl fullWidth>
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

            {/* Diabetes History */}
            <FormControl fullWidth>
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

            {/* Family Diabetes History */}
            <FormControl fullWidth>
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

            {/* Weight */}
            <TextField
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange(e)}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) input.value = '';
                }}
                fullWidth
            />

            {/* Height */}
            <TextField
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange(e)}
                onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (parseFloat(input.value) < 0) input.value = '';
                }}
                fullWidth
            />
        </Box>
    );
}
