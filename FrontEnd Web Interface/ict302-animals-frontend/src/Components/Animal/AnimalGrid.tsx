import React, { useEffect, useState } from 'react';
import { Grid2 as Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';
import { Theme } from '@mui/material/styles'; // Import the Theme type
import AnimalCard from './AnimalCard';

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

  // Fetch animals from API
  const fetchUploadedAnimals = async () => {
    try {
      const response = await fetch(API.Download() + '/animals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded animals');
      }
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger fetching when component mounts or refresh is triggered
  useEffect(() => {
    fetchUploadedAnimals();
  }, [triggerRefresh]);

  // Handle click to navigate to animal details page
  // *** consider remove this handleAnimalClick as onAnimalClick has same effect
  //const handleAnimalClick = (animalID: string) => {
    //console.log('Navigating to animalID:', animalID);
    //navigate(`/dashboard/animals/${animalID}`);
  //};

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
