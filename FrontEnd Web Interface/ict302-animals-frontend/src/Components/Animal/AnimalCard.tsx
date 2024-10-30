import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Chip, Stack, Typography, Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';
import DeleteAnimalButton from './DeleteAnimalButton';

// Define AnimalCardProps for the component
export type AnimalCardProps = {
  animalID: string;
  animalName: string;
  animalDOB: string; // animalDOB will be passed as a string
  animalType: string;
  onClick: () => void; // Add onClick prop
  onDeleteSuccess: () => void; // Add onDeleteSuccess prop
};

const AnimalCard: React.FC<AnimalCardProps> = ({ animalID, animalName, animalDOB, animalType, onClick, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const [animalImage, setAnimalImage] = useState<string>('');

  const handleGetAnimalImage = useCallback(async () => {

    try {// Use local fallback images rather than fetching missing images from the API
      const fallbackImage = `/assets/images/fallback/${animalType.toLowerCase()}.png`;
      setAnimalImage(fallbackImage);
      
    } catch (error) {
      console.error('Error fetching animal image:', error);
    }
  }, [animalType]);

  useEffect(() => {
    handleGetAnimalImage();
  }, [handleGetAnimalImage]);

  const formattedDOB = new Date(animalDOB).toLocaleDateString();

  const handleDeleteSuccess = () => {
    // Refresh the page or go backwards
    onDeleteSuccess();
  };


  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', flexGrow: 1, cursor: 'pointer' }}
      onClick={onClick} 
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid>
            {animalImage && (
                <img
                    src={animalImage}
                    alt={animalName}
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                />
            )}
          </Grid>
          <Grid>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Name: {animalName}
            </Typography>
            <Typography component="p" variant="body2" color="textSecondary">
              Date of Birth: {formattedDOB}
            </Typography>
            <Chip label={animalType} />
          </Grid>
          <Grid>
            {// TODO: Maybe change this to be 3 dots menu with delete option rather than delete button directly
            }
            <DeleteAnimalButton animalToDeleteId = {animalID}  onDeleteSuccess={handleDeleteSuccess}/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
