import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, AppBar, Tabs, Tab } from "@mui/material";
import API from "../../Internals/API";
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

// Type Definitions
interface AnimalDetailsProps {
  animalId: string; // Expecting animalId as a prop
  activeTab: number; // Tab index
  setActiveTab: React.Dispatch<React.SetStateAction<number>>; // Function to change the active tab
  setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>; // Function to change the active tab
}

// Functional Component Definition
const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
  
  //const { animalId: paramAnimalId } = useParams<{ animalId: string }>();  // this is using url approach
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [backBtnClicked, setBackBtnClicked] = useState(false);
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



  const handleBackBtnClick = () => {
    navigate('/dashboard/animals');
    setActiveTab(0);
    setSelectedAnimalId(null);
  }

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const togglePlayerClose = () => {
    setPlayerOpen(!PlayerOpen); 
  };

  const handleModelGeneration = () => {
    setGenerating(true);

    // Simulate the different stages of progress
    setProgressLabel("Pending");
    setTimeout(() => setProgressLabel("PreProcessing"), 1000);
    setTimeout(() => setProgressLabel("Generating"), 3000);
    setTimeout(() => setProgressLabel("Converting"), 5000);
    setTimeout(() => setProgressLabel("Cleaning-Up"), 7000);
    setTimeout(() => {
      setProgressLabel("Finished"); // Clear progress label when finished
      setGenerating(false); 
      setModelExist(true); 
    }, 3000);
  };

  const handleViewGeneration = () => {
    console.log("Viewing the generated model...");
  };

  return (
    <Box>
      {/* Fixed banner with animal photo and name */}
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Typography variant="h4">{animalData.animalName}</Typography>
        <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
        <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      </Box>

      {/* Tabs for different sections */}
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="animal details tabs">
          <Tab label="Information" />
          <Tab label="Media Uploaded" />
          <Tab label="Version" />
          <Tab label="Access Granted" />
        </Tabs>
      </AppBar>
    
          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
        {tabValue === 0 && (
          <Typography variant="body1">Details about {animalData.animalName} can go here.</Typography>
        )}
        
        {tabValue === 1 && (
        <Box>
          <Box>
            <Typography variant="body1">Media uploaded for {animalData.animalName}:</Typography>
            {videoUrl ? (
              <Box sx={{ marginTop: '20px' }}>
                <video controls width="600">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            ) : (
              <Typography>No video available.</Typography>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, border: '1px solid #ccc', borderRadius: '8px', padding: 3 }}>
            {animalId ? (videoUrl ? (
              <DeleteGraphicButton
                animaltoDelId={animalId}
                graphictoDelId={videoUrl}
                onDeleteSuccess={handleDeleteSuccess}/>
            ) : (
              <Typography>No video available.</Typography>
            )
            ) : (
            <Typography>No animal selected.</Typography>
            )}
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

          {/* New Generation Dialog */}
            {newGenOpen && (
              <NewGeneration 
                open={newGenOpen} 
                handleClose={() => setNewGenOpen(false)} 
                onGenerate={handleModelGeneration} 
                graphicID={"Test"} 
              />
            )}
            
        </Box>)}

        {tabValue === 2 && (
          <Typography variant="body1">Version history for {animalData.animalName} can go here.</Typography>
        )}

        {tabValue === 3 && (
          <Typography variant="body1">Access details for {animalData.animalName} can go here.</Typography>
        )}
      </Box>

      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Button variant="contained" onClick={handleBackBtnClick}>
          Back to Animals
        </Button>
      </Box>

    </Box>
  );
    
    
    
    
    
    
    
    
  
};

export default AnimalDetails;
