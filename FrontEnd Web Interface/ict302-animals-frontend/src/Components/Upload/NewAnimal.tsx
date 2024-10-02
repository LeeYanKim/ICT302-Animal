import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

interface NewAnimalProps {
  open: boolean;
  handleClose: () => void;
  addNewAnimal: (animalName: string) => void; // New prop to pass back the new animal
}

const animalTypesList = ["Mammal", "Bird", "Reptile", "Fish"]; // Initial animal types

const NewAnimal: React.FC<NewAnimalProps> = ({ open, handleClose, addNewAnimal }) => {
  const [animalName, setAnimalName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [animalTypes, setAnimalTypes] = useState(animalTypesList);
  const [isAddNewTypeDialogOpen, setIsAddNewTypeDialogOpen] = useState(false);
  const [newAnimalType, setNewAnimalType] = useState('');

  // Handle selecting an existing animal type
  const handleAnimalTypeChange = (event: SelectChangeEvent<string>) => {
    setAnimalType(event.target.value);
  };

  // Open dialog to add a new animal type
  const handleAddNewTypeOpen = () => {
    setIsAddNewTypeDialogOpen(true);
  };

  // Close dialog and reset the new animal type
  const handleAddNewTypeClose = () => {
    setIsAddNewTypeDialogOpen(false);
    setNewAnimalType('');
  };

  // Add the new animal type to the list and close the dialog
  const handleAddNewType = () => {
    if (newAnimalType && !animalTypes.includes(newAnimalType)) {
      setAnimalTypes([...animalTypes, newAnimalType]); // Add new type
      setAnimalType(newAnimalType); // Set it as the selected type
    }
    handleAddNewTypeClose(); // Close the dialog
  };

  const handleGenerate = () => {
    if (animalName) {
      addNewAnimal(animalName); // Pass the new animal name back to the parent (Tagging component)
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

      {/* Dialog for adding a new animal type */}
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
