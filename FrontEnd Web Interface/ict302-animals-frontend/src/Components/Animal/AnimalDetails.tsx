import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import API from "../../Internals/API"; 
import { useNavigate } from 'react-router-dom';
import GenerateButton from "../Generation/GenerateButton";

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
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // Ensure animalId is available before making a request
  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalData = async () => {
      try {
        const response = await fetch(API.Download() + `/animals/details/${animalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data = await response.json();
        setAnimalData(data);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      } finally {
        setLoading(false); // Set loading to false after API call
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> {/* Better loading feedback */}
      </Box>
    );
  }

  if (!animalData) {
    return <div>No animal data available.</div>;
  }

  const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${animalData.videoFileName}`
    : null;

  return (
    <Box textAlign="center" sx={{ mt: 5 }}>
      <Typography variant="h4">{animalData.animalName}</Typography>
      <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
      <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      
      {/* Display video */}
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {videoUrl ? (
          <>
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <GenerateButton/>
          </>
        ) : (
          <Typography>No video available.</Typography>
        )}

      </Box>
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button component="label" variant="contained"
          onClick={() => {
            navigate('/dashboard/animals/');
          }}
          >
            Back
          </Button>
        </Box>
        
    </Box>
  );
};

export default AnimalDetails;
