import React, {useContext} from 'react';

import { UserProfileContext } from "../Internals/ContextStore";

import QueueCard from '../Components/Queue/QueueCard';

import {Box, Stack, Grid2 as Grid, alpha} from '@mui/material';

const Queue: React.FC = () => {
  const userContext = useContext(UserProfileContext);

  //TODO Add queue update logic

  return (
    <Box sx={{ display: 'flex' }}>
          <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: alpha(theme.palette.background.default, 1),
                overflow: 'auto',
              })}
          >
            Items in Queue : {userContext.contextRef?.current.currentItemsInQueue}
            <Grid container
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mx: 3,
                  pb: 10,
                  mt: { xs: 8, md: 0 },
                }}
            >
              
                {userContext.contextRef?.current.currentItemsInQueue > 0 && userContext.contextRef?.current.currentItemsInProcessQueue.map((item, index) => (
                  <Grid>
                    <QueueCard key={index} title={item.name} position={index} progress={item.progress}/>
                  </Grid>
                ))} 
              
            </Grid>
          </Box>
        </Box>
  );
}

export default Queue;