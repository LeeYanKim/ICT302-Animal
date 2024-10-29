import React, { useContext, useState } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { FrontendContext } from '../Internals/ContextStore';
import UploadPrompt from '../Components/Upload/UploadPrompt';
import { UploadProps } from '../Components/Upload/UploadProps';
import RecentlyUploaded from '../Components/Upload/RecentlyUploaded';

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {

  const [refreshThumbnails, setRefreshThumbnails] = React.useState(false);
  const frontendContext = useContext(FrontendContext);


  // Function to trigger a refresh of the thumbnails
  const triggerThumbnailRefresh = () => {
    setRefreshThumbnails(!refreshThumbnails);  // Toggle state to trigger re-fetch
  };

  return (
    <>
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        {/* Upload Button */}
        <Box
          sx={{
            background: 'linear-gradient(125deg, rgba(255,105,105,0.9), rgba(173,216,230,0.6))',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
            color: '#000',
          }}
        >
          <UploadPrompt onUploadSuccess={triggerThumbnailRefresh} />
        </Box>

        {/* Recently Uploaded Section */}
        <Box sx={{ maxWidth: '1050px', margin: '0 auto' }}>
        <RecentlyUploaded triggerRefresh={refreshThumbnails} />
        </Box>
        
      </Box>
    </>
  );
};

export default Upload;
