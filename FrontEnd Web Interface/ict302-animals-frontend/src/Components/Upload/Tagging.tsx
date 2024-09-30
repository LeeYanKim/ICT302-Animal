import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { MenuItem, Select, FormControl, InputLabel, Typography, Box, SelectChangeEvent } from '@mui/material';

interface TaggingProps {
  open: boolean;
  handleClose: () => void;
}

//TODO 
//Don't upload media until tagging is done
//Implement new animal page
//Make it look not crap

export default function Tagging({ open, handleClose }: TaggingProps) {
  const [selectedAnimal, setSelectedAnimal] = React.useState('name1');
  const [generator, setGenerator] = React.useState('GART');


  const handleAnimalChange = (event: SelectChangeEvent<string>) => {
    setSelectedAnimal(event.target.value);
  };

  const handleGeneratorChange = (event: SelectChangeEvent<string>) => {
    setGenerator(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Successful</DialogTitle>
      <DialogContent>
        {/* Informational text */}
        <Typography variant="body1" gutterBottom>
          Your file has been uploaded successfully! Please enter animal details to continue.
        </Typography>

        {/* Animal selection */}
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
          <Button color="primary" variant="outlined" style={{ marginTop: '10px' }}>
            Add new Animal
          </Button>
        </Box>

        {/* Generator selection */}
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

      <DialogActions>
        {/* Actions */}
        <Button onClick={handleClose} color="primary" variant="contained">
          Generate
        </Button>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
