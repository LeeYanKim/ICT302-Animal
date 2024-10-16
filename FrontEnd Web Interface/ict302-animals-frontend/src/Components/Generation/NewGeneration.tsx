import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";

interface GenerateProps {
  open: boolean;
  handleClose: () => void;
  onGenerate: () => void;  
  graphicID: string;
}

export default function NewGeneration({ open, handleClose, onGenerate, graphicID }: GenerateProps) {
  const [selectedOption, setSelectedOption] = useState("");  

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  const handleGenerateClick = () => {
    onGenerate(); 
    handleClose();  
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Generate Options for Graphic: {graphicID}</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1">
          Please select a generator option for this graphic.
        </Typography>

        <Box mt={2}>
          <FormControl fullWidth>
            <InputLabel>Generator Type</InputLabel>
            <Select value={selectedOption} onChange={handleSelectChange}>
              <MenuItem value="GART">GART</MenuItem>
              <MenuItem value="BITE">BITE</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleGenerateClick} color="primary">
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
