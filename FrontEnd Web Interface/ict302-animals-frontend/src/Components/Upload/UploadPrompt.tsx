import React, { ChangeEvent, useState, useContext, DragEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NewAnimal from './NewAnimal';
import NewUpload from './NewUpload';
import { UploadProps } from './UploadProps'; 
import { FrontendContext } from '../../Internals/ContextStore'; // Import your context

const UploadPrompt: React.FC<UploadProps> = ({
  alertQueue,
  setAlertQueue,
  onUploadSuccess,
}) => {
  const frontendContext = useContext(FrontendContext); // Access context if needed

  const [isAnimalFormOpen, setIsAnimalFormOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [animalDetails, setAnimalDetails] = useState({
    animalName: '',
    animalType: '',
    dateOfBirth: '',
  });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false); // State for drag-over styling

  // Handle file selection and open the animal form
  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFilesToUpload((prevFiles) => [...prevFiles, ...selectedFiles]); // Append files to the existing list
    }
  };

  // Handle drag-over event
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true); // Add drag-over styling
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDragOver(false); // Remove drag-over styling
  };

  // Handle drop event to accept dropped files
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false); // Remove drag-over styling
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFilesToUpload((prevFiles) => [...prevFiles, ...droppedFiles]); // Append dropped files to the existing list
    }
  };

  // Handle submission of the animal form
  const handleAnimalFormSubmit = (animalData: {
    animalName: string;
    animalType: string;
    dateOfBirth: string;
  }) => {
    setAnimalDetails(animalData);
    setIsAnimalFormOpen(false);
    setIsUploadFormOpen(true);
  };

  const handleUploadFormClose = (canceled: boolean) => {
    if (!canceled) {
      onUploadSuccess(); // Trigger the success callback
    }
    setIsUploadFormOpen(false);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <FrontendContext.Provider value={frontendContext}> {/* Context provider */}
      <div style={{ width: '85vw', margin: 10, padding: 0 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip label="mp4" />
            <Chip label="mkv" />
            <Chip label="mov" />
            <Chip label="webm" />
          </Box>

          {/* Drag-and-Drop Zone */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${isDragOver ? '#1976d2' : '#ccc'}`,
              borderRadius: 4,
              padding: 3,
              textAlign: 'center',
              backgroundColor: isDragOver ? '#f5f5f5' : 'transparent',
              cursor: 'pointer',
              marginTop: 2,
              transition: 'background-color 0.3s',
            }}
          >
            <Typography variant="body1">
              Drag and Drop Your Files Here or Click Below
            </Typography>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Select Files
              <input
                type="file"
                accept=".mp4, .mkv, .mov, .webm"
                hidden
                multiple // Enable multiple file selection
                onChange={handleFileSelection}
              />
            </Button>
          </Box>

          {/* Display Selected Files */}
          {filesToUpload.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Selected Files:</Typography>
              <List>
                {filesToUpload.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Proceed Button */}
          {filesToUpload.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAnimalFormOpen(true)}
              >
                Proceed to Animal Details
              </Button>
            </Box>
          )}
        </Box>

        {/* Animal form dialog */}
        <NewAnimal
          open={isAnimalFormOpen}
          handleClose={() => setIsAnimalFormOpen(false)}
          addNewAnimal={handleAnimalFormSubmit}
        />

        {/* Upload form dialog */}
        <NewUpload
          open={isUploadFormOpen}
          handleClose={handleUploadFormClose}
          animalDetails={animalDetails}
          filesToUpload={filesToUpload}
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
    </FrontendContext.Provider>
  );
};

export default UploadPrompt;
