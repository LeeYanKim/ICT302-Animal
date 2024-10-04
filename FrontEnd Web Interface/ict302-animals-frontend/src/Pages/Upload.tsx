import React, { useContext } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { FrontendContext } from '../Internals/ContextStore';
import UploadPrompt from '../Components/Upload/UploadPrompt';
import { UploadProps } from '../Components/Upload/UploadProps';

const Upload: React.FC<UploadProps> = ({ alertQueue, setAlertQueue }) => {
  const frontendContext = useContext(FrontendContext);

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
    <>
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        {/* Upload Button */}
        <Box
          sx={{
            background: 'linear-gradient(90deg, rgba(255,105,105,0.7), rgba(173,216,230,0.6))', // More red in pink to blue gradient
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow
            marginBottom: '30px',
            color: '#000', // Darker text for contrast
          }}
        >
          <UploadPrompt alertQueue={alertQueue} setAlertQueue={setAlertQueue} />
        </Box>

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
    </>
  );
};

export default Upload;
