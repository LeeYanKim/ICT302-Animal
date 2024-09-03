import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

interface NewUploadProps {
  open: boolean;
  handleClose: () => void;
}

export default function NewUpload({ open, handleClose }: NewUploadProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleClose();
        },
      }}
    >
    <DialogTitle>Warning</DialogTitle>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText>
            This application is a work in progress. Please do not upload any sensitive or personal information.
            <br />
            Currently the application only uses default internal image to illistrate the upload process.
        </DialogContentText>
        <Button variant='outlined' type='button' disabled={true}>
            Upload Media
        </Button>
    </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
                Continue
            </Button>
        </DialogActions>
    </Dialog>
    );
}
