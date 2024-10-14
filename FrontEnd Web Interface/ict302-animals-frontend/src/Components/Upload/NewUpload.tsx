// NewUpload.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';

import API from '../../Internals/API';

interface NewUploadProps {
  open: boolean;
  handleClose: (canceled: boolean) => void;
  animalDetails: {
    animalName: string;
    animalType: string;
    dateOfBirth: string;
  };
  filesToUpload: File[]; // Changed from single File to an array of Files
}

export default function NewUpload({ open, handleClose, animalDetails, filesToUpload }: NewUploadProps) {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handle File Upload
  const handleFileUpload = async () => {
    if (!filesToUpload || filesToUpload.length === 0) {
      setErrorMessage('No files selected for upload.');
      setIsSnackbarOpen(true);
      return;
    }

    // Check for missing animal details
    if (!animalDetails.animalName || !animalDetails.animalType || !animalDetails.dateOfBirth) {
      setErrorMessage('Missing animal details. Please provide all required information.');
      setIsSnackbarOpen(true);
      return;
    }

    setIsUploading(true);

    // Prepare form data for the upload
    const formData = new FormData();

    // Append animal details
    formData.append('animalName', animalDetails.animalName);
    formData.append('animalType', animalDetails.animalType);
    const formattedDOB = animalDetails.dateOfBirth;
    formData.append('dateOfBirth', formattedDOB);

    // Append each file
    filesToUpload.forEach((file) => {
      formData.append('files', file); // Ensure the key is 'files' to match the backend
    });

    try {
      const response = await fetch(API.Upload(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Upload failed. Unsupported file type or invalid data.');
        setIsSnackbarOpen(true);
      } else {
        const data = await response.json();
        console.log('Upload success:', data);
        handleClose(false); // Close the dialog after successful upload
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Upload failed. Please try again.');
      setIsSnackbarOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  // Automatically initiate the file upload if open is true and files are selected
  useEffect(() => {
    if (open && filesToUpload && filesToUpload.length > 0) {
      handleFileUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filesToUpload]);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleClose(true)}>
        <DialogTitle>{isUploading ? 'Uploading...' : 'Upload Videos'}</DialogTitle>
        <DialogContent>
          {isUploading ? (
            <Typography variant="body1">
              Uploading your videos for the animal: {animalDetails.animalName}
            </Typography>
          ) : (
            <Typography variant="body1">Preparing to upload your videos...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)} disabled={isUploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error messages */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
