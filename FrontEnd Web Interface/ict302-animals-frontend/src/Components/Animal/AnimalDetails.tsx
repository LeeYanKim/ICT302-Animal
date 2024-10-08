import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ModelViewer from "../ModelViewer/ModelViewer";

const AnimalDetails: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Extract animalId from the URL
  const [animalData, setAnimalData] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoType, setVideoType] = useState<string>('');

  // Fetch the animal data (including video) based on the animalId
  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await fetch(`http://localhost:5173/api/files/animals/details/${animalId}`);
        if (!response.ok) throw new Error('Failed to fetch animal data');
        const data = await response.json();
        setAnimalData(data);
        setVideoUrl(`http://localhost:5173/api/files/animals/videos/${data.videoFileName}`);
        const fileExtension = data.videoFileName.split('.').pop();
        let mimeType = '';
        switch (fileExtension) {
          case 'webm':
            mimeType = 'video/webm';
            break;
          case 'mp4':
            mimeType = 'video/mp4';
            break;
          case 'mkv':
            mimeType = 'video/x-matroska';
            break;
          case 'mov':
            mimeType = 'video/quicktime';
            break;
          default:
            console.error('Unsupported video format');
        }
        setVideoType(mimeType);
      } catch (error) {
        console.error('Error fetching animal data:', error);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (!animalData) return <div>Loading...</div>;

  return (
    <div>
    <Box textAlign="center" sx={{ mt: 5 }}>
      <Typography variant="h4">{animalData.animalName}</Typography>
      <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
      <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      
      {/* Display video */}
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video controls width="600">
          <source src={videoUrl} type={videoType} />
          Your browser does not support the video tag.
        </video>
      </Box>
      <Typography mt={3} variant="subtitle1">GART model:</Typography>
      <Box  sx={{ display: 'flex' , justifyContent: 'center'}}>
        {/*Change this when we have models*/}
      <ModelViewer modelPath={'/3d_test_files/toon_cat_free.glb'}/>
      </Box>
    </Box>
    </div>
  );
};

export default AnimalDetails;
