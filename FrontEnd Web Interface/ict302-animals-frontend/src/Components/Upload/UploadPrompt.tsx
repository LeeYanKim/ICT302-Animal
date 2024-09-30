import React, {ChangeEvent, useContext} from 'react';

import { UserProfileContext } from "../../Internals/ContextStore";

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Box, FormLabel, styled} from '@mui/material';

import NewUpload from './NewUpload';

import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {UploadProps} from './UploadProps';
import  UserAlert  from '../../Internals/components/Alerts/Alert';

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

  return (
    <div>
      <h1>Get Started Uploading Videos!</h1>
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
        <FormControl>
            <FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignSelf: 'center'}}>
                    <Button
                        onClick={handleClickOpen}
                        variant={'contained'}
                        sx={{ alignSelf: 'baseline' }}
                        >
                        Upload Video
                    </Button>
                </Box>
            </FormControl>
            <NewUpload open={open} handleClose={handleClose} />
        </FormControl>
      </Box>
    </div>
  );
}

export default UploadPrompt;