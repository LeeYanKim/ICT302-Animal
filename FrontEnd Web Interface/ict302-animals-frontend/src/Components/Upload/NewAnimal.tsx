import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField, Box, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

interface NewAnimalProps {
  open: boolean;
  handleClose: () => void;
  addNewAnimal: (animalName: string, animalType: string, dateOfBirth: string) => void; // Updated to pass all animal details
}

const animalTypesList = ["Mammal", "Bird", "Reptile", "Fish"];

const NewAnimal: React.FC<NewAnimalProps> = ({ open, handleClose, addNewAnimal }) => {
  const [animalName, setAnimalName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [animalTypes, setAnimalTypes] = useState(animalTypesList);
  const [isAddNewTypeDialogOpen, setIsAddNewTypeDialogOpen] = useState(false);
  const [newAnimalType, setNewAnimalType] = useState('');

  const handleAnimalTypeChange = (event: SelectChangeEvent<string>) => {
    setAnimalType(event.target.value);
  };

  const handleAddNewTypeOpen = () => {
    setIsAddNewTypeDialogOpen(true);
  };

  const handleAddNewTypeClose = () => {
    setIsAddNewTypeDialogOpen(false);
    setNewAnimalType('');
  };

  const handleAddNewType = () => {
    if (newAnimalType && !animalTypes.includes(newAnimalType)) {
      setAnimalTypes([...animalTypes, newAnimalType]);
      setAnimalType(newAnimalType);
    }
    handleAddNewTypeClose();
  };

  const handleGenerate = () => {
    if (animalName && animalType && dateOfBirth) {
      addNewAnimal(animalName, animalType, dateOfBirth); // Pass all animal details
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add a new animal</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Please enter the details of your new animal.
          </Typography>

          <Box mt={2}>
            <TextField
              label="Animal Name"
              variant="outlined"
              fullWidth
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              margin="normal"
            />

            <TextField
              label="Date of Birth"
              variant="outlined"
              fullWidth
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <Select
                labelId="animal-type-label"
                value={animalType}
                onChange={handleAnimalTypeChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Animal Type</em>
                </MenuItem>
                {animalTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleAddNewTypeOpen}
              color="primary"
              variant="outlined"
              sx={{ marginTop: '10px' }}
            >
              Add New Animal Type
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleGenerate} color="primary" variant="contained">
            Add
          </Button>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddNewTypeDialogOpen} onClose={handleAddNewTypeClose}>
        <DialogTitle>Add New Animal Type</DialogTitle>
        <DialogContent>
          <TextField
            label="New Animal Type"
            variant="outlined"
            fullWidth
            value={newAnimalType}
            onChange={(e) => setNewAnimalType(e.target.value)}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAddNewType} color="primary" variant="contained">
            Add
          </Button>
          <Button onClick={handleAddNewTypeClose} color="secondary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewAnimal;
