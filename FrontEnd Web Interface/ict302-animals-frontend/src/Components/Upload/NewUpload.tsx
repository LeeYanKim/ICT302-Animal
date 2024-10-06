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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface NewUploadProps {
  open: boolean;
  handleClose: (canceled: boolean) => void;
  animalDetails: {
    animalName: string;
    animalType: string;
    dateOfBirth: string;
  };
  fileToUpload: File | null;
}

export default function NewUpload({ open, handleClose, animalDetails, fileToUpload }: NewUploadProps) {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Handle File Upload
  const handleFileUpload = async () => {
    if (!fileToUpload) {
      setErrorMessage('No file selected for upload.');
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
    formData.append('files', fileToUpload); // Ensure the key is 'files' to match the backend
    formData.append('animalName', animalDetails.animalName);
    formData.append('animalType', animalDetails.animalType);

    // Format the date as 'YYYY-MM-DD' (standard format) for proper backend parsing
    const formattedDOB = new Date(animalDetails.dateOfBirth).toISOString().split('T')[0];
    formData.append('animalDOB', formattedDOB);

    try {
      const response = await fetch('http://localhost:5173/api/upload', {
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

  // Automatically initiate the file upload if open is true and file is selected
  useEffect(() => {
    if (open && fileToUpload) {
      handleFileUpload();
    }
  }, [open, fileToUpload]);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={() => handleClose(true)}>
        <DialogTitle>{isUploading ? 'Uploading...' : 'Upload Video'}</DialogTitle>
        <DialogContent>
          {isUploading ? (
            <Typography variant="body1">Uploading your video for the animal: {animalDetails.animalName}</Typography>
          ) : (
            <Typography variant="body1">Preparing to upload your video...</Typography>
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
