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
  videoUrl: string; // New prop to pass the video URL
}
interface TaggingProps {
  open: boolean;
  handleClose: () => void;
  closeUploadDialog: () => void;
  videoUrl: string; // Add videoUrl prop to accept the video preview
}

export default function Tagging({ open, handleClose, closeUploadDialog, videoUrl }: TaggingProps) {
  const [selectedAnimal, setSelectedAnimal] = React.useState('name1');
  const [generator, setGenerator] = React.useState('GART');
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

  const handleGenerate = () => {
    setIsSnackbarOpen(true);
    handleClose();
    closeUploadDialog();
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
                <MenuItem value="Jax">Jax</MenuItem>
                <MenuItem value="Max">Max</MenuItem>
                <MenuItem value="Fernet">Fernet</MenuItem>
                <MenuItem value="Aqua">Aqua</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => setIsNewAnimalOpen(true)} color="primary" variant="outlined" style={{ marginTop: '10px' }}>
              Add new Animal
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

          {/* Video Player */}
          {videoUrl && (
            <Box mt={3}>
              <video width="100%" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleGenerate} color="primary" variant="contained">
            Generate
          </Button>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <NewAnimal open={isNewAnimalOpen} handleClose={handleNewAnimalClose} />

      <Snackbar open={isSnackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Animal details saved successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
