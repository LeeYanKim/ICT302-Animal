import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';
import AnimalCard from '../Animal/AnimalCard';

// Props for RecentlyUploaded
interface RecentlyUploadedProps {
  triggerRefresh: boolean;
}

interface AnimalData {
  animalID: string;
  animalName: string;
  animalType: string;
  videoUploadDate: string | null; // Keep it as string or null
}

const RecentlyUploaded: React.FC<RecentlyUploadedProps> = ({ triggerRefresh }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // Fetch uploaded animals
  const fetchUploadedAnimals = async () => {
    try {
      const response = await fetch(API.Download() + '/animals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded animals');
      }
      const data = await response.json();
      setAnimals(data);
      setFilteredAnimals(data);
      const types: string[] = Array.from(new Set(data.map((animal: AnimalData) => animal.animalType)));
      setAnimalTypes(types);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUploadedAnimals();
  }, [triggerRefresh]);

  // Handle animal card click
  const handleAnimalClick = (animalID: string) => {
    console.log('Navigating to animalID:', animalID);
    navigate(`/dashboard/animals/${animalID}`);
  };

  // Filter button click handler
  const handleFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ marginBottom: '20px', textAlign: 'left' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Recently uploaded:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
          <Button variant="outlined" onClick={handleFilterButtonClick} sx={{ marginRight: '10px' }}>
            Filter by Animal Type
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => setFilteredAnimals(animals)}>All</MenuItem>
            {animalTypes.map((type) => (
              <MenuItem key={type} onClick={() => setFilteredAnimals(animals.filter((animal) => animal.animalType === type))}>
                {type}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.animalID}>
            <AnimalCard
              animalID={animal.animalID}
              animalName={animal.animalName}
              animalDOB={animal.videoUploadDate || 'N/A'}
              animalType={animal.animalType}
              onClick={() => handleAnimalClick(animal.animalID)} // Pass onClick prop
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RecentlyUploaded;
