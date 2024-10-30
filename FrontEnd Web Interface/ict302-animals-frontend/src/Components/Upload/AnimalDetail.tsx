import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import API from '../../Internals/API';
import { Animal } from '../Animal/AnimalInterfaces';
import {FrontendContext} from "../../Internals/ContextStore";

const AnimalDetails: React.FC = () => {
  const frontendContext = useContext(FrontendContext);
  const userAnimals = frontendContext.user.contextRef.current.userAnimals;
  const { animalId } = useParams<{ animalId: string }>(); // Extract animalId from the URL
  const [animalData, setAnimalData] = useState<Animal | null>(null);

  // Ensure animalId is available before making a request
  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalData = async () => {
      if(userAnimals !== null) {
        const animal = userAnimals.find((a) => a.animalID === animalId);
        setAnimalData(animal ? animal : null);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (!animalData) {
    return (<CircularProgress />);
  }

  const videoUrl = animalData.graphics.length > 0
    ? API.Download() + `/animals/videos/${animalData.graphics[0].filePath}`
    : null;

  return (
    <Box textAlign="center" sx={{ mt: 5 }}>
      <Typography variant="h4">{animalData.animalName}</Typography>
      <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
      <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      
      {/* Display video */}
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {videoUrl ? (
          <video controls width="600">
            {videoUrl.endsWith('.mp4') && <source src={videoUrl} type="video/mp4" />}
            {videoUrl.endsWith('.webm') && <source src={videoUrl} type="video/webm" />}
            {videoUrl.endsWith('.mov') && <source src={videoUrl} type="video/quicktime" />}
            {videoUrl.endsWith('.mkv') && <source src={videoUrl} type="video/x-matroska" />}
            Your browser does not support the video tag.
          </video>
        ) : (
          <Typography>No video available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AnimalDetails;
