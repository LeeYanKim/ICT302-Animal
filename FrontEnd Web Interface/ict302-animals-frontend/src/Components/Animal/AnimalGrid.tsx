import React, { useContext, useEffect, useState } from 'react';
import { Grid2 as Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';
import { Theme } from '@mui/material/styles'; // Import the Theme type
import AnimalCard from './AnimalCard';
import { FrontendContext } from '../../Internals/ContextStore';

// Props interface for AnimalsGrid
interface AnimalsGridProps {
  triggerRefresh: boolean;
  onAnimalClick: (animalID: string) => void; // Add this line
}

interface AnimalData {
  animalID: string;
  animalName: string;
  animalType: string;
  videoUploadDate: string | null;
}

const AnimalsGrid: React.FC<AnimalsGridProps> = ({ triggerRefresh, onAnimalClick }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const navigate = useNavigate();
  
  const frontendContext = useContext(FrontendContext);
  const userId = frontendContext.user.contextRef.current.userId; // Get userId from context




  // Fetch animal IDs and details for the user
  const fetchAnimalsData = async () => {
    try {
      const animalAccessResponse = await fetch(API.Download() + `/user/${userId}/animalIDs`);
      if (animalAccessResponse.ok) {
        const animalIDs = await animalAccessResponse.json();
        console.log(animalIDs);
        // Fetch details for each animal ID
        const animalDetailsPromises = animalIDs.map((animalID: string) =>
          fetch(API.Download() + `/animals/details/${animalID}`)
        );
        const animalDetailsResponses = await Promise.all(animalDetailsPromises);
        const animalsData = await Promise.all(
          animalDetailsResponses.map(response => response.json())
        );
        
        setAnimals(animalsData);
      } else {
        console.error('Failed to fetch animals data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAnimalsData(); // Fetch animals when userId is available
    }
  }, [userId]);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme: Theme) => theme.spacing(2) }}>
        {animals.length > 0 && animals.map((animal) => (
          <Grid sx={{xs: 12, sm: 6, md: 4}} key={animal.animalID}>
            <AnimalCard
              animalID={animal.animalID}
              animalName={animal.animalName}
              animalDOB={animal.videoUploadDate || ''}
              animalType={animal.animalType}
              onClick={() => onAnimalClick(animal.animalID)}
            />
          </Grid>
        ))}
        {animals.length === 0 && (
          <Grid sx={{xs: 12, sm: 6, md: 4}}>
            <Typography variant="h6">No animals found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AnimalsGrid;
