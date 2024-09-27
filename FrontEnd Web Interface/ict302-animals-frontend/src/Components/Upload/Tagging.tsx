import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

interface TaggingProps {
  open: boolean;
  handleClose: () => void;
}

//TODO 
//Dont upload media until tagging is done
//implement new animal page
//make it look not crap

export default function Tagging({ open, handleClose }: TaggingProps) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload Successful</DialogTitle>
      <DialogContent>
        Your file has been uploaded successfully!
        <br/>
        Please enter animal details to continue.
        <br/>
        Animal name:
        <select name="cars" id="cars">
            <option value="name1">name1</option>
            <option value="name2">name2</option>
            <option value="name3">name3</option>
            <option value="name4">name4</option>
        </select>
        <Button>go to new Animal page</Button> 
        <br/>
        Generator : 
        <select name="Generators" id="Generators">
            <option value="GART">GART</option>
        </select>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color ="primary">Generate</Button>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}