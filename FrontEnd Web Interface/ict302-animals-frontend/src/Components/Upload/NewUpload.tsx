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
import Tagging from "./Tagging";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // For displaying alert styles




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

    const [isTaggingOpen, setIsTaggingOpen] = React.useState(false); // State for Tagging dialog
    const [errorMessage, setErrorMessage] = React.useState(''); // State for error message
    const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false); // State for snackbar visibility


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
            if (!response.ok) {
                // If the response is not OK (e.g., 400), show an error
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Upload failed. Unsupported file type.');
                setIsSnackbarOpen(true);
            } else {
                const data = await response.json();
                console.log(data);
                setIsTaggingOpen(true);  // Proceed if upload is successful
            }
            
        } catch (error) {
            console.error(error);
            setErrorMessage('Upload failed. Please try again.');
            setIsSnackbarOpen(true);  // Open the Snackbar
        }
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };


    const handleTaggingClose = () => {
        setIsTaggingOpen(false);
    }

  return (
    <>
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
            Accepted file types: mp4, mkv, mov
        </DialogContentText>
        <Button component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
        >
            Upload Video
            <VisuallyHiddenInput
                type='file'
                onChange={handleFileUpload}
                multiple
            />
        </Button>
    </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => handleClose(true)}>Cancel</Button>
        </DialogActions>
    </Dialog>

<Tagging open={isTaggingOpen} handleClose={handleTaggingClose} />


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

</>
    );
}
