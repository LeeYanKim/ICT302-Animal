import React, {useContext} from 'react';

import { FrontendContext } from "../Internals/ContextStore";

import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import ModelViewer from '../Components/ModelViewer/ModelViewer';

import CompletedCard from '../Components/Completed/CompletedCard';


const Completed: React.FC = () => {
  const frontendContext = useContext(FrontendContext);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {frontendContext.user.contextRef.current.completedItems.map((items, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <CompletedCard title={items.name} status={items.status} modelPath={items.modelPath}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Completed;