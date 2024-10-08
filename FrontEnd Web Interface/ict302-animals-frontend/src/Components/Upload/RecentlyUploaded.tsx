import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import API from '../../Internals/API';

interface RecentlyUploadedProps {
  triggerRefresh: boolean; // Prop to trigger the refresh of uploaded data
}

interface AnimalData {
  animalID: string;
  animalName: string;
  animalType: string;
  videoUploadDate: string | null;
}

const RecentlyUploaded: React.FC<RecentlyUploadedProps> = ({ triggerRefresh }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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

  const handleAnimalClick = (animalID: string) => {
    console.log('Navigating to animalID:', animalID);
    if (animalID) {
      navigate(`/animals/${animalID}`);
    } else {
      console.error('Animal ID is undefined. Cannot navigate to animal details.');
    }
  };

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
      setFilteredAnimals(animals.filter((animal) => animal.animalType === type));
    }
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
            <MenuItem onClick={() => handleFilterSelect('All')}>All</MenuItem>
            {animalTypes.map((type) => (
              <MenuItem key={type} onClick={() => handleFilterSelect(type)}>
                {type}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredAnimals.map((animal) => {
          //console.log('Animal data:', animal); // Log the entire animal object to verify
          if (!animal.animalID) {
            console.error('Animal ID is undefined. Cannot navigate to animal details.');
          }
          return (
            <Grid item xs={12} sm={6} md={4} key={animal.animalID}>
              <Box
                sx={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  height: '150px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (animal.animalID) {
                    handleAnimalClick(animal.animalID);
                  }
                }}
              >
                {animal.animalName && (
                  <>
                    <Typography variant="subtitle1">{animal.animalName}</Typography>
                    <Typography variant="body2">{`Type: ${animal.animalType}`}</Typography>
                    <Typography variant="subtitle2">
                      {`Uploaded on: ${
                        animal.videoUploadDate
                          ? new Date(animal.videoUploadDate).toLocaleDateString()
                          : 'N/A'
                      }`}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default RecentlyUploaded;
