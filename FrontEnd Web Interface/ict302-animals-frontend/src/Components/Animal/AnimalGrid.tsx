import React, { useContext, useEffect, useState } from 'react';
import { Grid2 as Grid, Box, Typography, Button, Menu, MenuItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';
import { Theme } from '@mui/material/styles';
import AnimalCard from './AnimalCard';
import { FrontendContext } from '../../Internals/ContextStore';

// Props interface for AnimalsGrid
interface AnimalsGridProps {
  triggerRefresh: boolean;
  onAnimalClick: (animalID: string, animalName: string) => void;

}

interface AnimalData {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string | null;
  videoUploadDate: string | null;
}

const AnimalsGrid: React.FC<AnimalsGridProps> = ({ triggerRefresh, onAnimalClick }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]); // For filtered animals
  const [animalTypes, setAnimalTypes] = useState<string[]>([]); // For animal types
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('All'); // Default filter
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for filter menu

  const navigate = useNavigate();
  
  const frontendContext = useContext(FrontendContext);
  const userId = frontendContext.user.contextRef.current.userId; // Get userId from context

  // Fetch animal IDs and details for the user
  const fetchAnimalsData = async () => {
    try {
      const animalAccessResponse = await fetch(API.Download() + `/user/${userId}/animalIDs`);
      if (animalAccessResponse.ok) {
        const animalIDs = await animalAccessResponse.json();
        //console.log("Fetched animal IDs:", animalIDs);
  
        // Filter out duplicate IDs
        const uniqueAnimalIDs = Array.from(new Set(animalIDs));
  
        // Fetch details for each unique animal ID
        const animalDetailsPromises = uniqueAnimalIDs.map((animalID: string) =>
          fetch(API.Download() + `/animals/details/${animalID}`)
        );
        const animalDetailsResponses = await Promise.all(animalDetailsPromises);
        const animalsData = await Promise.all(
          animalDetailsResponses.map(response => response.json())
        );

  
        // Filter out duplicate animals by checking their IDs
        const uniqueAnimals = animalsData.filter(
          (animal, index, self) => index === self.findIndex((a) => a.animalID === animal.animalID)
        );
  
        setAnimals(uniqueAnimals);
        setFilteredAnimals(uniqueAnimals); // Initially show all animals

        // Extract unique animal types for the filter dropdown
        const types = Array.from(new Set(uniqueAnimals.map((animal) => animal.animalType)));
        setAnimalTypes(types);
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

  // Handle filter change
  const handleFilterSelect = (type: string) => {
    setSelectedAnimalType(type);
    setFilteredAnimals(type === 'All' ? animals : animals.filter(animal => animal.animalType === type));
    setAnchorEl(null); // Close the filter menu
  };

  const handleFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); // Open the filter menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the filter menu
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>

      <Box sx={{ marginBottom: '20px', textAlign: 'left' }}>
        <Button variant="outlined" onClick={handleFilterButtonClick}>
          Filter by Animal Type
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleFilterSelect('All')}>All</MenuItem>
          {animalTypes.map((type) => (
            <MenuItem key={type} onClick={() => handleFilterSelect(type)}>{type}</MenuItem>
          ))}
        </Menu>
      </Box>

      <Grid container spacing={2} display="flex" alignItems="center">
        {filteredAnimals.length > 0 && filteredAnimals.map((animal) => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={animal.animalID}>
            <AnimalCard
              animalID={animal.animalID}
              animalName={animal.animalName}
              animalDOB={animal.animalDOB || ''}
              animalType={animal.animalType}
              onClick={() => onAnimalClick(animal.animalID , animal.animalName)}
              onDeleteSuccess={fetchAnimalsData}
            />
          </Grid>
        ))}
        {filteredAnimals.length === 0 && (
          <Grid size={{xs: 12, sm: 6, md: 4}}>
            <Typography variant="h6">No animals found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AnimalsGrid;
