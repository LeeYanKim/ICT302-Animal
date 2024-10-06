import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Menu, MenuItem } from '@mui/material';

interface RecentlyUploadedProps {
  triggerRefresh: boolean; // Prop to trigger the refresh of uploaded data
}

interface AnimalData {
  animalId: string;
  animalName: string;
  animalType: string;
  videoUploadDate: string;
}

const RecentlyUploaded: React.FC<RecentlyUploadedProps> = ({ triggerRefresh }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fetchUploadedAnimals = async () => {
    try {
      const response = await fetch('http://localhost:5173/api/files/animals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded animals at Recently uploaded');
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

  const handleFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (type: string) => {
    if (type === 'All') {
      setFilteredAnimals(animals);
    } else {
      setFilteredAnimals(animals.filter(animal => animal.animalType === type));
    }
    setAnchorEl(null);
  };

  // Set the desired number of items to be displayed in the grid
  const desiredGridItemCount = 9;
  const itemsToDisplay = [...filteredAnimals];
  const placeholdersCount = Math.max(0, desiredGridItemCount - itemsToDisplay.length);
  
  // Add placeholders to maintain consistent grid layout
  for (let i = 0; i < placeholdersCount; i++) {
    itemsToDisplay.push({
      animalId: `placeholder-${i}`,
      animalName: '',
      animalType: '',
      videoUploadDate: '',
    } as AnimalData);
  }

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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleFilterSelect('All')}>All</MenuItem>
            {animalTypes.map((type) => (
              <MenuItem key={type} onClick={() => handleFilterSelect(type)}>{type}</MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Grid of uploaded animal data */}
      <Grid container spacing={3}>
        {itemsToDisplay.map((animal, index) => (
          <Grid item xs={12} sm={6} md={4} key={animal.animalId || `placeholder-${index}`}>
            <Box
              sx={{
                padding: '10px',
                border: animal.animalName ? '1px solid #ddd' : 'none',
                borderRadius: '5px',
                height: '150px',
                visibility: animal.animalName ? 'visible' : 'hidden',
                backgroundColor: animal.animalName ? 'transparent' : 'none'
              }}
            >
              {animal.animalName && (
                <>
                  <Typography variant="subtitle1">{animal.animalName}</Typography>
                  <Typography variant="body2">{`Type: ${animal.animalType}`}</Typography>
                  <Typography variant="subtitle2">
                    {`Uploaded on: ${new Date(animal.videoUploadDate).toLocaleDateString()}`}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RecentlyUploaded;
