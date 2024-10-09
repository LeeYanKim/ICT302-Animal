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
  videoUploadDate: string;
  videoFileName: string; // Include video file name
}

const RecentlyUploaded: React.FC<RecentlyUploadedProps> = ({ triggerRefresh }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null); // State to hold the selected animal
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);

  const fetchUploadedAnimals = async () => {
    setLoading(true);
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
      setError('An error occurred while fetching animal data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedAnimals();
  }, [triggerRefresh]);

  const handleAnimalClick = (animal: AnimalData) => {
    setSelectedAnimal(animal); // Set the selected animal
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

  /*const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${selectedAnimal.videoFileName}`
    : null;
  */
 
  if (loading) {
    return <Typography>Loading...</Typography>;
  }


  return (
      <div>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ marginBottom: '20px', textAlign: 'left' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Recently uploaded:</Typography>
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

      {/* Video Player */}
      {selectedAnimal && (
        <Box sx={{ marginTop: '20px' }}>
          <h2>{selectedAnimal.animalName}</h2>
          <p>Type: {selectedAnimal.animalType}</p>
          <p>Date of Birth: {new Date(selectedAnimal.videoUploadDate!).toLocaleDateString()}</p>
          {selectedAnimal.videoFileName ? (
            <video controls width="600">
              <source src={API.Download() +`/animals/videos/${selectedAnimal.videoFileName}`}/>
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available.</p>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredAnimals.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.animalID}>
            <Box
              sx={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                height: '150px',
                cursor: 'pointer',
              }}
              onClick={() => handleAnimalClick(animal)} // Pass the entire animal object
            >
              {animal.animalName && (
                <>
                  <Typography variant="subtitle1">{animal.animalName}</Typography>
                  <Typography variant="body2">{`Type: ${animal.animalType}`}</Typography>
                  <Typography variant="subtitle2">
                    {`Uploaded on: ${animal.videoUploadDate ? new Date(animal.videoUploadDate).toLocaleDateString() : 'N/A'}`}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

    </div>
  );
};

export default RecentlyUploaded;
