import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  videoFileName?: string;
}

const AnimalDetails: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Extract animalId from the URL
  const [animalData, setAnimalData] = useState<Animal | null>(null);

  // Ensure animalId is available before making a request
  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalData = async () => {
      try {
        // Use the correct endpoint for fetching animal details
        const response = await fetch(`http://localhost:5173/api/files/animals/details/${animalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data = await response.json();
        setAnimalData(data);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (!animalData) {
    return <div>Loading...</div>;
  }

  const videoUrl = animalData.videoFileName
    ? `http://localhost:5173/api/files/animals/videos/${animalData.videoFileName}`
    : null;

  return (
    <Box textAlign="center" sx={{ mt: 5 }}>
      <Typography variant="h4">{animalData.animalName}</Typography>
      <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
      <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      
      {/* Display video */}
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {videoUrl ? (
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Typography>No video available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AnimalDetails;
