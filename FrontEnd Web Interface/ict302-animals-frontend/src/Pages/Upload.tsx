import React, { useContext } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { UserProfileContext } from '../Internals/ContextStore';
import UploadPrompt from '../Components/Upload/UploadPrompt';
import { UploadProps } from '../Components/Upload/UploadProps';

const Upload: React.FC<UploadProps> = ({ alertQueue, setAlertQueue }) => {
  const userContext = useContext(UserProfileContext);

  const animalImages = [
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',
    'https://via.placeholder.com/250x150',

  ];

  return (
    <Box sx={{ padding: '20px', textAlign: 'center' }}>
      {/* Upload Button */}
      <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Get Started Uploading!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ backgroundColor: '#6A4D32', marginBottom: '40px', fontSize: '18px' }}
      >
        Upload Media
      </Button>

      {/* Recently Uploaded Section */}
      <Box sx={{ marginBottom: '20px', textAlign: 'left' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Recently uploaded:
        </Typography>

        {/* Example Filters (Can Be Optional/Customized) maybe a hover feature? */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
          <Button
            startIcon={<i className="fas fa-filter" />}
            variant="outlined"
            sx={{ marginRight: '10px' }}
          >
            Filter
          </Button>
          <Button variant="outlined" sx={{ marginRight: '10px' }}>
            Animal Type
          </Button>
          <Button variant="outlined">Date Animal Uploaded</Button>
        </Box>
      </Box>

      {/*I know that Grid is depreciated, but grid2 isnt working */}
      <Grid container spacing={3}>
        {/* Loop through the animalImages array to dynamically create grid items */}
        {animalImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <img
              src={image}
              alt={`Animal ${index + 1}`}
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Upload;
