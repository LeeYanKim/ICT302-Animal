import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { MenuItem, Select, FormControl, InputLabel, Typography, Box, SelectChangeEvent, Snackbar, Alert } from '@mui/material';
import NewAnimal from './NewAnimal';

interface TaggingProps {
  open: boolean;
  handleClose: () => void;
  closeUploadDialog: () => void;
  videoUrl: string; // To pass the video URL for preview
  onGenerate: () => void;  // Add this prop to notify when generate is called to refresh the thumbnails
}

export default function Tagging({ open, handleClose, closeUploadDialog, videoUrl ,onGenerate }: TaggingProps) {
  const [selectedAnimal, setSelectedAnimal] = React.useState(''); // Selected animal state
  const [animals, setAnimals] = React.useState(['Jax', 'Max', 'Fernet', 'Aqua']); // Existing animals
  const [generator, setGenerator] = React.useState('GART'); // Selected generator state
  const [isNewAnimalOpen, setIsNewAnimalOpen] = React.useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);

  const handleAnimalChange = (event: SelectChangeEvent<string>) => {
    setSelectedAnimal(event.target.value);
  };

  const handleGeneratorChange = (event: SelectChangeEvent<string>) => {
    setGenerator(event.target.value);
  };

  const handleNewAnimalClose = () => {
    setIsNewAnimalOpen(false);
  };

  const handleAddNewAnimal = (newAnimal: string) => {
    // Add the new animal to the list and set it as the selected animal
    setAnimals([...animals, newAnimal]);
    setSelectedAnimal(newAnimal);
    setIsNewAnimalOpen(false); // Close the new animal dialog
  };

  const handleGenerate = () => {
    setIsSnackbarOpen(true);
    handleClose(); // Close tagging dialog
    closeUploadDialog(); // Close upload video dialog
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Your file has been uploaded successfully! Please enter animal details to continue.
          </Typography>



          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="animal-select-label">Animal Name</InputLabel>
              <Select
                labelId="animal-select-label"
                id="animals"
                value={selectedAnimal}
                onChange={handleAnimalChange}
              >
                {animals.map((animal) => (
                  <MenuItem key={animal} value={animal}>
                    {animal}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={() => setIsNewAnimalOpen(true)}
              color="primary"
              variant="outlined"
              style={{ marginTop: '10px' }}
            >
              Add New Animal
            </Button>
          </Box>

          <Box mt={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="generator-select-label">Generator</InputLabel>
              <Select
                labelId="generator-select-label"
                id="Generators"
                value={generator}
                onChange={handleGeneratorChange}
              >
                <MenuItem value="GART">GART</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        {/* Video Preview */}
        {videoUrl && (
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <video width="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}


        <DialogActions>
          <Button onClick={handleGenerate} color="primary" variant="contained">
            Generate
          </Button>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <NewAnimal
        open={isNewAnimalOpen}
        handleClose={handleNewAnimalClose}
        addNewAnimal={handleAddNewAnimal} // Pass the addNewAnimal function to NewAnimal
      />

      <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Animal details saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
