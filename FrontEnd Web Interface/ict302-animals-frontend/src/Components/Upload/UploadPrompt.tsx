import React, { ChangeEvent, useState, useEffect } from 'react';
import { FormControl, Box, Typography, Button, Snackbar, Alert, TextField, MenuItem, Grid, Chip, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadProps } from './UploadProps';
import NewAnimal from './NewAnimal';  // Import the NewAnimal form
import NewUpload from './NewUpload';   // Import the NewUpload form for final upload

const UploadPrompt: React.FC<UploadProps> = ({ alertQueue, setAlertQueue, onUploadSuccess }) => {
  const [isAnimalFormOpen, setIsAnimalFormOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null); // Store the selected file
  const [animalDetails, setAnimalDetails] = useState({
    animalName: '',
    animalType: '',
    dateOfBirth: ''
  });  // Store animal details

  // States for filters
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Control filter dialog visibility
  const [animalTypeFilter, setAnimalTypeFilter] = useState<string>('All');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // State for uploaded animals
  const [uploadedAnimals, setUploadedAnimals] = useState<any[]>([]);

  // Handle file selection and open the animal form
  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);  // Store selected file
      setIsAnimalFormOpen(true);  // Open the form for animal details
    }
  };

  // Handle submission of the animal form
  const handleAnimalFormSubmit = (name: string, type: string, dob: string) => {
    setAnimalDetails({ animalName: name, animalType: type, dateOfBirth: dob });
    setIsAnimalFormOpen(false);  // Close the form
    setIsUploadFormOpen(true);   // Open the upload form to initiate upload
  };

  // Handle closing the upload form
  const handleUploadFormClose = (canceled: boolean) => {
    if (!canceled) {
      onUploadSuccess();
      fetchUploadedAnimals();  // Fetch updated list of uploaded animals
    }
    setIsUploadFormOpen(false);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  // Fetch uploaded animals data
  const fetchUploadedAnimals = async () => {
    try {
      const response = await fetch('http://localhost:5173/api/upload/animals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded animals');
      }
      const data = await response.json();

      // Apply filters before setting the state
      let filteredData = data;

      if (animalTypeFilter !== 'All') {
        filteredData = filteredData.filter((animal: any) => animal.animalType === animalTypeFilter);
      }

      if (startDateFilter && endDateFilter) {
        const startDate = new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
        filteredData = filteredData.filter((animal: any) => {
          const uploadDate = new Date(animal.videoUploadDate);
          return uploadDate >= startDate && uploadDate <= endDate;
        });
      }

      setUploadedAnimals(filteredData);
    } catch (error) {
      console.error('Error fetching uploaded animals:', error);
      setErrorMessage('Failed to fetch uploaded animals');
      setIsSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchUploadedAnimals();  // Fetch animals when component mounts or filters change
  }, [animalTypeFilter, startDateFilter, endDateFilter]);

  const handleFilterButtonClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);
    fetchUploadedAnimals(); // Fetch updated list with applied filters
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
        }}>
        <Typography variant='h2' sx={{ alignSelf: 'center' }}>
          Get Started Uploading!
        </Typography>
        <Typography variant='body1' sx={{ alignSelf: 'center' }}>
          This application is a work in progress.
        </Typography>
        <Typography variant='body1' sx={{ alignSelf: 'center' }}>
          Accepted file types
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
            Select File
            <input
              type='file'
              accept=".mp4, .mkv, .mov, .webm"
              hidden
              onChange={handleFileSelection}  // Trigger file selection
            />
          </Button>
        </Box>
      </Box>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <DialogTitle>Apply Filters</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Animal Type"
              value={animalTypeFilter}
              onChange={(e) => setAnimalTypeFilter(e.target.value)}
              sx={{ width: '200px' }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Mammal">Mammal</MenuItem>
              <MenuItem value="Bird">Bird</MenuItem>
              <MenuItem value="Reptile">Reptile</MenuItem>
              <MenuItem value="Fish">Fish</MenuItem>
              {/* Add more types if needed */}
            </TextField>
            <TextField
              label="Start Date"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFilterOpen(false)}>Cancel</Button>
          <Button onClick={handleFilterApply} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Grid of uploaded animal images */}
      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Recently uploaded:
        </Typography>
        <Grid container spacing={3}>
          {uploadedAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.animalId}>
              <Box sx={{ border: '1px solid #ddd', borderRadius: '10px', padding: '10px' }}>
                <Typography variant="subtitle1">{animal.animalName}</Typography>
                <Typography variant="body2">Type: {animal.animalType}</Typography>
                <Typography variant="subtitle2">
                  {`Uploaded on: ${new Date(animal.videoUploadDate).toLocaleDateString()}`}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Animal form dialog */}
      <NewAnimal
        open={isAnimalFormOpen}
        handleClose={() => setIsAnimalFormOpen(false)}
        addNewAnimal={(name, type, dob) => handleAnimalFormSubmit(name, type, dob)}  // Submit animal details
      />

      {/* Upload form dialog */}
      <NewUpload
        open={isUploadFormOpen}
        handleClose={handleUploadFormClose}
        animalDetails={animalDetails}  // Pass the animal details to upload form
        fileToUpload={fileToUpload}    // Pass the selected file to upload form
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
}

export default UploadPrompt;
