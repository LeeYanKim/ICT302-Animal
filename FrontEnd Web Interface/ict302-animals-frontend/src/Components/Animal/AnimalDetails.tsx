import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Divider } from "@mui/material";
import API from "../../Internals/API";
import { useNavigate } from 'react-router-dom';
import DeleteGraphicButton from './DeleteGraphicButton';
import NewGeneration from "../Generation/NewGeneration"; 
import ViewGenerateButton from "../Generation/ViewGenerationButton";  

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  videoFileName?: string;
}

const AnimalDetails: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); 
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [PlayerOpen, setPlayerOpen] = useState(false);
  const [ModelExist, setModelExist] = useState<boolean>(false);  
  const [newGenOpen, setNewGenOpen] = useState<boolean>(false);  
  const [generating, setGenerating] = useState<boolean>(false); 
  const [progressLabel, setProgressLabel] = useState<string>("Pending"); // Label for progress steps

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
        setLoading(false); 
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleDeleteSuccess = () => {
    // Implement your logic to refresh the graphics list or handle UI changes
    console.log('Graphic deleted successfully');
  };

  if (!animalData) {
    return <Typography variant="h6" color="error">No animal data available.</Typography>;
  }

  const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${animalData.videoFileName}`
    : null;

  const togglePlayerClose = () => {
    setPlayerOpen(!PlayerOpen); 
  };

  const handleModelGeneration = async () => {
    setGenerating(true);
    const res = await fetch(API.Generate(), {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ AnimalId: animalId, AnimalGraphicFileName: animalData.videoFileName, GenType: "BITE"}),
    });

    // Simulate the different stages of progress
    setProgressLabel("Pending");
    await setTimeout(() => setProgressLabel("PreProcessing"), 1000);
    await setTimeout(() => setProgressLabel("Generating"), 3000);
    await setTimeout(() => setProgressLabel("Converting"), 5000);
    await setTimeout(() => setProgressLabel("Cleaning-Up"), 7000);
    await setTimeout(() => {
      setProgressLabel("Finished"); // Clear progress label when finished
      setGenerating(false); 
      setModelExist(true); 
    }, 3000);
  };

  const handleViewGeneration = () => {
    console.log("Viewing the generated model...");
  };

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

        <Box 
          sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 4, 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: 3 
          }}>
        
        {animalId ? (
          videoUrl ? (
            <DeleteGraphicButton
              animaltoDelId={animalId}
              graphictoDelId={videoUrl}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ) : (
            <Typography>No video available.</Typography>
          )
        ) : (
          <Typography>No animal selected.</Typography>
        )}
      </Box>
    </Box>

          {/* Video Player */}
          <Box sx={{ flex: 1, maxWidth: '1000px' }}>  {/* Set maxWidth here */}
            {videoUrl && PlayerOpen ? (
              <>
              <Button 
                  component="label" 
                  variant="contained" 
                  sx={{  marginBottom: 2 }}
                  onClick={togglePlayerClose}
                >
                  Close {animalData.videoFileName}
                  </Button>
                <video controls width="100%" style={{ borderRadius: '8px', maxWidth: '800px' }}>  {/* maxWidth for the video */}
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : (
              <Button 
                component="label" 
                variant="contained" 
                sx={{ mt: 2, width: '100%', backgroundColor: '#1976d2', color: '#fff' }} 
                onClick={togglePlayerClose}
              >
                View {animalData.videoFileName}
              </Button>
            )}
          </Box>

          {/* Generated Model Viewer */}
          <Box sx={{ flex: 1 }}>
            {generating ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>{progressLabel}</Typography> {/* Show progress label */}
              </Box>
            ) : (
              ModelExist ? (
                <ViewGenerateButton />
              ) : (
                <Button 
                  component="label" 
                  variant="contained" 
                  sx={{ width: '100%' }} 
                  onClick={() => setNewGenOpen(true)}
                >
                  Generate New Model
                </Button>
              )
            )}
          </Box>
        

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary">Generated Video:</Typography>
          <Box component="ol" sx={{ listStylePosition: 'inside', paddingLeft: 0, textAlign: 'center' }}>
            <li>Video ID: </li>
            <li>Date Uploaded: </li> 
            <li>Size: </li>
          </Box>
        </Box>

        <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            component="label" 
            variant="contained"
            onClick={() => navigate('/dashboard/animals/')}
          >
            Back to Dashboard
          </Button>
        </Box>
      
      {/* New Generation Dialog */}
      {newGenOpen && (
        <NewGeneration 
          open={newGenOpen} 
          handleClose={() => setNewGenOpen(false)} 
          onGenerate={handleModelGeneration} 
          graphicID={"Test"} 
        />
      )}
    </Box>
  );
};

export default AnimalDetails;
