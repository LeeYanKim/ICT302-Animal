import React, { useEffect, useState } from 'react';
import { Box, Grid2 as Grid, Typography, Button, Menu, MenuItem } from '@mui/material';
import API from '../../Internals/API';

interface GraphicData {
  gpcID: string;
  gpcName: string;
  gpcDateUpload: string;
  filePath: string;
  animalID: string;
  gpcSize: number;
}

interface AnimalData {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  graphics: GraphicData[];
}

interface RecentlyUploadedProps {
  triggerRefresh: boolean;
}

const RecentlyUploaded: React.FC<RecentlyUploadedProps> = ({ triggerRefresh }) => {
  const [animals, setAnimals] = useState<AnimalData[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<AnimalData[]>([]);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null);

  const fetchUploadedAnimals = async () => {
    setLoading(true);
    try {
      const response = await fetch(API.Download() + '/animals/list');
      if (!response.ok) {
        throw new Error('Failed to fetch uploaded animals');
      }
      const data: AnimalData[] = await response.json();
      if (data.length > 0) {
        setAnimals(data);
        setFilteredAnimals(data);
        const types = Array.from(new Set(data.map((animal) => animal.animalType)));
        setAnimalTypes(types);
      } else {
        setError('No animals found.');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching animal data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimalDetails = async (animalID: string) => {
    try {
      const response = await fetch(API.Download() + `/animals/details/${animalID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch animal details');
      }
      const animal = await response.json();
      console.log('Animal Details:', animal); // Debug log to inspect response
      setSelectedAnimal(animal);
    } catch (error) {
      console.error('Error fetching animal details:', error);
    }
  };

  useEffect(() => {
    fetchUploadedAnimals();
  }, [triggerRefresh]);

  const handleAnimalClick = (animal: AnimalData) => {
    fetchAnimalDetails(animal.animalID);
  };

  const handleFilterButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (type: string) => {
    setFilteredAnimals(type === 'All' ? animals : animals.filter((a) => a.animalType === type));
    setAnchorEl(null);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <div>
        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ marginBottom: '20px', textAlign: 'left' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Recently uploaded:</Typography>
          <Button variant="outlined" onClick={handleFilterButtonClick}>Filter by Animal Type</Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleFilterSelect('All')}>All</MenuItem>
            {animalTypes.map((type) => (
              <MenuItem key={type} onClick={() => handleFilterSelect(type)}>{type}</MenuItem>
            ))}
          </Menu>
        </Box>

        {selectedAnimal && (
          <Box>
            <Typography variant="h4">{selectedAnimal.animalName}</Typography>
            <Typography variant="subtitle1">Type: {selectedAnimal.animalType}</Typography>
            <Typography variant="subtitle2">DOB: {new Date(selectedAnimal.animalDOB).toLocaleDateString()}</Typography>
            {selectedAnimal.graphics && selectedAnimal.graphics.length > 0 ? (
              selectedAnimal.graphics.map((graphic) => (
                <div key={graphic.gpcID} style={{ marginBottom: '20px' }}>
                  <h4>{graphic.gpcName}</h4>
                  <video
                    key={graphic.filePath}
                    controls
                    style={{
                      width: '600px', // Fixed width
                      height: '340px', // Fixed height to ensure consistency
                      objectFit: 'cover', // Makes the video cover the area while maintaining aspect ratio
                      backgroundColor: 'black', // Adds background in case of cropping
                    }}
                  >
                    <source src={graphic.filePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))
            ) : (
              <Typography>No videos available.</Typography>
            )}
          </Box>
        )}

        {/* Display only the 6 most recent uploads */}
        <Grid container spacing={3}>
          {filteredAnimals.length > 0 && filteredAnimals.slice(0, 9).map((animal) => (  // Limit to 6 most recent animals
            <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={animal.animalID}>
              <Box
                sx={{ padding: '10px', border: '1px solid #ddd', cursor: 'pointer' }}
                onClick={() => handleAnimalClick(animal)}
              >
                <Typography variant="subtitle1">{animal.animalName}</Typography>
                <Typography variant="body2">{animal.animalType}</Typography>
                <Typography variant="subtitle2">
                  {new Date(animal.animalDOB).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          ))}
          {filteredAnimals.length === 0 && <Typography>No animals found.</Typography>}
        </Grid>
      </div>
    </div>
  );
};

export default RecentlyUploaded;
