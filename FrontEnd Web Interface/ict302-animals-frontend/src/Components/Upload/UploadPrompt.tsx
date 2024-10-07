// UploadPrompt.tsx
import React, { ChangeEvent, useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NewAnimal from './NewAnimal';
import NewUpload from './NewUpload';
import { UploadProps } from './UploadProps';
        
import { FrontendContext } from "../../Internals/ContextStore";
import API from '../../Internals/API';


const UploadPrompt: React.FC<UploadProps> = ({ alertQueue, setAlertQueue, onUploadSuccess }) => {
  const [isAnimalFormOpen, setIsAnimalFormOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [animalDetails, setAnimalDetails] = useState({
    animalName: '',
    animalType: '',
    dateOfBirth: '',
  });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

    const frontendContext = useContext(FrontendContext);
    
  // Handle file selection and open the animal form
  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
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
    if (animalData.file) {
      setFileToUpload(animalData.file);
    }
    setIsAnimalFormOpen(false);
    setIsUploadFormOpen(true);
  };

  const handleUploadFormClose = (canceled: boolean) => {
    if (!canceled) {
      // Optionally refresh the list of uploaded animals
    }
    setIsUploadFormOpen(false);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div>
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
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Chip label='mp4' />
          <Chip label='mkv' />
          <Chip label='mov' />
          <Chip label='webm' />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Select File
            <input
              type="file"
              accept=".mp4, .mkv, .mov, .webm"
              hidden
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
        fileToUpload={fileToUpload}
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
