// UploadPrompt.tsx
import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NewAnimal from './NewAnimal';
import NewUpload from './NewUpload';
import { UploadProps } from './UploadProps';

const UploadPrompt: React.FC<UploadProps> = ({ alertQueue, setAlertQueue, onUploadSuccess }) => {
  const [isAnimalFormOpen, setIsAnimalFormOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]); // Changed to an array of Files
  const [animalDetails, setAnimalDetails] = useState({
    animalName: '',
    animalType: '',
    dateOfBirth: '',
  });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file selection and open the animal form
  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFilesToUpload(selectedFiles);
      setIsAnimalFormOpen(true);
    }
  };

  // Handle submission of the animal form
  const handleAnimalFormSubmit = (animalData: {
    animalName: string;
    animalType: string;
    dateOfBirth: string;
    file?: File;
  }) => {
    setAnimalDetails({
      animalName: animalData.animalName,
      animalType: animalData.animalType,
      dateOfBirth: animalData.dateOfBirth,
    });
    setIsAnimalFormOpen(false);
    setIsUploadFormOpen(true);
  };

  const handleUploadFormClose = (canceled: boolean) => {
    if (!canceled) {
      // Optionally refresh the list of uploaded animals
      onUploadSuccess && onUploadSuccess();
    }
    setIsUploadFormOpen(false);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div style={{ width: `85vw`, margin: 10, padding: 0 }}>
      <Box
        component="form"
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <Typography variant="h2" sx={{ alignSelf: 'center' }}>
          Get Started Uploading!
        </Typography>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          This application is a work in progress.
        </Typography>
        <Typography variant="body1" sx={{ alignSelf: 'center' }}>
          Accepted file types
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip label="mp4" />
          <Chip label="mkv" />
          <Chip label="mov" />
          <Chip label="webm" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Select Files
            <input
              type="file"
              accept=".mp4, .mkv, .mov, .webm"
              hidden
              multiple // Allow multiple file selection
              onChange={handleFileSelection}
            />
          </Button>
        </Box>
      </Box>

      {/* Animal form dialog */}
      <NewAnimal
        open={isAnimalFormOpen}
        handleClose={() => setIsAnimalFormOpen(false)}
        addNewAnimal={handleAnimalFormSubmit}
        requireFile={false} // No need to require file here as it's already selected
      />

      {/* Upload form dialog */}
      <NewUpload
        open={isUploadFormOpen}
        handleClose={handleUploadFormClose}
        animalDetails={animalDetails}
        filesToUpload={filesToUpload} // Pass the array of files
      />

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
    </div>
  );
};

export default UploadPrompt;
