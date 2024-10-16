
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';

interface AnimalDetails {
  animalName: string;
  animalType?: string;
  dateOfBirth?: string;
  file?: File;
}

interface NewAnimalProps {
  open: boolean;
  handleClose: () => void;
  addNewAnimal: (animalDetails: AnimalDetails) => void;
  requireFile?: boolean; // New prop to indicate if file selection is required
}

const animalTypesList = ["Mammal", "Bird", "Reptile", "Fish"];

const NewAnimal: React.FC<NewAnimalProps> = ({
  open,
  handleClose,
  addNewAnimal,
  requireFile = false, // Default to false
}) => {
  const [animalName, setAnimalName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [animalType, setAnimalType] = useState<string>("");
  const [animalTypes, setAnimalTypes] = useState<string[]>(animalTypesList);
  const [isAddNewTypeDialogOpen, setIsAddNewTypeDialogOpen] = useState<boolean>(false);
  const [newAnimalType, setNewAnimalType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAnimalTypeChange = (event: SelectChangeEvent<string>) => {
    setAnimalType(event.target.value as string);
  };

  const handleAddNewTypeOpen = () => {
    setIsAddNewTypeDialogOpen(true);
  };

  const handleAddNewTypeClose = () => {
    setIsAddNewTypeDialogOpen(false);
    setNewAnimalType("");
  };

  const handleAddNewType = () => {
    if (newAnimalType && !animalTypes.includes(newAnimalType)) {
      setAnimalTypes([...animalTypes, newAnimalType]);
      setAnimalType(newAnimalType);
    }
    handleAddNewTypeClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleGenerate = () => {
    if (animalName && (!requireFile || (requireFile && selectedFile))) {
      addNewAnimal({
        animalName,
        animalType,
        dateOfBirth,
        file: selectedFile || undefined,
      });
      handleClose();
    } else {
      alert("Please fill in all required fields.");
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
              required
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
              required={requireFile} // Required only if file is required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="animal-type-label">Animal Type</InputLabel>
              <Select
                labelId="animal-type-label"
                value={animalType[0]}
                onChange={handleAnimalTypeChange}
                label="Animal Type"
                required={requireFile} // Required only if file is required
              >
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
              sx={{ marginTop: "10px" }}
            >
              Add New Animal Type
            </Button>

            {/* File Input */}
            {requireFile && (
              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  Select a video file for the animal:
                </Typography>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <Typography variant="body2">
                    Selected file: {selectedFile.name}
                  </Typography>
                )}
              </Box>
            )}
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
