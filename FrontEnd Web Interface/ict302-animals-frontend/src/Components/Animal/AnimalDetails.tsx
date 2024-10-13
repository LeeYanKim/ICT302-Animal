import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import API from "../../Internals/API"; 
import { useNavigate } from 'react-router-dom';
import NewGeneration from "../Generation/NewGeneration";  // Import your NewGeneration component
import ViewGenerateButton from "../Generation/ViewGenerationButton";  // Import ViewGenerationButton

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
  const [PlayerOpen, setPlayerOpen] = useState(false);
  const [ModelExist, setModelExist] = useState<boolean>(false);  // Track if the model exists
  const [newGenOpen, setNewGenOpen] = useState<boolean>(false);  // Track if the NewGeneration modal is open
  const [generating, setGenerating] = useState<boolean>(false);  // Track progress state

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
        <CircularProgress /> {/* Loading feedback */}
      </Box>
    );
  }

  if (!animalData) {
    return <div>No animal data available.</div>;
  }

  const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${animalData.videoFileName}`
    : null;

  const togglePlayerClose = () => {
    setPlayerOpen(!PlayerOpen);
  };

  const handleModelGeneration = () => {
    // Trigger progress wheel when generating
    setGenerating(true);

    // Simulate 3-second generation process
    setTimeout(() => {
      setGenerating(false);  // Stop showing progress wheel
      setModelExist(true);    // Indicate that the model has been generated
    }, 3000);
  };

  const openNewGeneration = () => {
    setNewGenOpen(true);  // Open the NewGeneration modal
  };

  const closeNewGeneration = () => {
    setNewGenOpen(false);  // Close the NewGeneration modal
  };

  return (
    <>
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Typography variant="h4">{animalData.animalName}</Typography>
        <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
        <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>

        <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {videoUrl ? (
            <>
              {PlayerOpen ? (
                <>
                  <video controls width="600">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <Box mt={2}>
                    <Button 
                      component="label" 
                      variant="contained" 
                      onClick={togglePlayerClose}
                    >
                      Close {animalData.videoFileName}
                    </Button>
                  </Box>
                </>
              ) : (
                <Button 
                  component="label"
                  variant="contained"
                  onClick={togglePlayerClose}
                >
                  View {animalData.videoFileName}
                </Button>
              )}

              {/* Show progress wheel during generation */}
              {generating ? (
                <CircularProgress />
              ) : (
                ModelExist ? (
                  <ViewGenerateButton />
                ) : (
                  <Button 
                    component="label" 
                    variant="contained" 
                    onClick={openNewGeneration}
                  >
                    Generate New Model
                  </Button>
                )
              )}

            </>
          ) : (
            <Typography>No video available.</Typography>
          )}
        </Box>

        <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button 
            component="label" 
            variant="contained"
            onClick={() => navigate('/dashboard/animals/')}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Conditionally render the NewGeneration modal */}
      {newGenOpen && (
        <NewGeneration open={newGenOpen} handleClose={closeNewGeneration} onGenerate={handleModelGeneration} graphicID={"Test"} />
      )}
    </>
  );
};

export default AnimalDetails;
