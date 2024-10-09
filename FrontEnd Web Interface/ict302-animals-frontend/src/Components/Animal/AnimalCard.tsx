import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../Internals/API';

// Define AnimalCardProps for the component
export type AnimalCardProps = {
  animalID: string;
  animalName: string;
  animalDOB: string; // animalDOB will be passed as a string
  animalType: string;
  onClick: () => void; // Add onClick prop
};

const AnimalCard: React.FC<AnimalCardProps> = ({ animalID, animalName, animalDOB, animalType, onClick }) => {
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

  return (
    <Card
      variant="outlined"
      sx={{ height: '100%', minWidth: 450, flexGrow: 1, cursor: 'pointer' }}
      onClick={onClick} // Use the onClick prop here
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Name: {animalName}
        </Typography>
        <Typography component="p" variant="body2" color="textSecondary">
          Date of Birth: {formattedDOB}
        </Typography>
        <Stack direction="column" sx={{ justifyContent: 'space-between', flexGrow: 1, gap: 1 }}>
          <Stack sx={{ justifyContent: 'space-between' }}>
            {animalImage && (
              <img
                src={animalImage}
                alt={animalName}
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
              />
            )}
            <Stack direction="row" sx={{ justifyContent: 'center' }}>
              <Chip label={animalType} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
