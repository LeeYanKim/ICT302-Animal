import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from "@mui/material";
import {ChangeEvent} from "react";
import {Form} from "react-bootstrap";

interface NewUploadProps {
  open: boolean;
  handleClose: (canceled: boolean) => void;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function NewUpload({ open, handleClose }: NewUploadProps) {

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log('File Upload', e.target.files);
        if(e.target.files === null) return;

        const formData = new FormData();
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append('files', e.target.files[i], e.target.files[i].name);
            }
        }

        try {
            const response = await fetch('http://localhost:5173/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);
            handleClose(true)
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose(false);
        },
      }}
    >
    <DialogTitle>Warning</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>
            This application is a work in progress. Please do not upload any sensitive or personal information.
            <br/>
            Accepted file types: png, jpg, jpeg, mp4, mkv, mov
        </DialogContentText>
        <Button component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
        >
            Upload Media
            <VisuallyHiddenInput
                type='file'
                accept=".png, .jpg, .jpeg, .mp4, .mkv, .mov"
                onChange={handleFileUpload}
                multiple
            />
        </Button>
    </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => handleClose(true)}>Cancel</Button>
        </DialogActions>
    </Dialog>
    );
}
