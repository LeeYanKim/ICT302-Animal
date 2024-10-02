import React, {ChangeEvent, useContext} from 'react';

import { UserProfileContext } from "../../Internals/ContextStore";
import API from '../../Internals/API';


import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Box, FormLabel, styled, Typography, Chip} from '@mui/material';

import NewUpload from './NewUpload';

import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {UploadProps} from './UploadProps';
import  UserAlert  from '../../Internals/components/Alerts/Alert';

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

const UploadPrompt: React.FC<UploadProps> = ({alertQueue, setAlertQueue}) => {
  const userContext = useContext(UserProfileContext);

  const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (canceled: boolean) => {
        setOpen(false);
        if(canceled) return;

        setAlertQueue([...alertQueue, <UserAlert icon={<CheckIcon/>} severity='success' message="Upload Successful" progress={null}/>]);
        userContext.contextRef.current.currentItemsInQueue += 1;
        userContext.contextRef.current.currentItemsInProcessQueue.push({id: '0', name: 'Test', size: 100, type: 'image', progress: 0, status: 'Uploading'});
    };

    const HandleSubmit = () => {
        console.log('Submit');

    }

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
          const response = await fetch(API.Upload(), {
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
    <div>
      <Box
        component="form"
        onSubmit={HandleSubmit}
        noValidate
        sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
        }}>
        <Typography variant='h2' sx={{alignSelf: 'center'}}>
          Get Started Uploading!
        </Typography>
        <Typography variant='body1' sx={{alignSelf: 'center'}}>
          This application is a work in progress.
        </Typography>
        <Typography variant='body1' sx={{alignSelf: 'center'}}>
          Please do not upload any sensitive or personal information.
        </Typography>
        <Typography variant='body1' sx={{alignSelf: 'center'}}>
          Accepted file types
        </Typography>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Chip label='png'/>
          <Chip label='jpg' />
          <Chip label='jpeg' />
          <Chip label='mp4' />
          <Chip label='mkv' />
          <Chip label='mov' />
        </Box>
        <FormControl>
          <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignSelf: 'center'}}>
              <Button component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}>
                    Upload Media
                <VisuallyHiddenInput
                    type='file'
                    accept=".png, .jpg, .jpeg, .mp4, .mkv, .mov"
                    onChange={handleFileUpload}
                    multiple
                />
              </Button>
            </Box>
          </FormControl>
        </FormControl>
      </Box>
    </div>
  );
}

export default UploadPrompt;