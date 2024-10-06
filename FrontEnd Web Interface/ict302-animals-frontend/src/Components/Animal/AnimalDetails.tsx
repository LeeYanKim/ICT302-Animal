import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const AnimalDetails: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Extract animalId from the URL
  const [animalData, setAnimalData] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  

  return (
    <Box>
      This is animal Details!
      
    </Box>
  );
};

export default AnimalDetails;
