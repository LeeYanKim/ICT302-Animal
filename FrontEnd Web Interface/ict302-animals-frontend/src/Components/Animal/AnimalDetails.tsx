import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, AppBar, Tabs, Tab } from "@mui/material";
import API from "../../Internals/API"; 
import { useNavigate } from 'react-router-dom';

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  videoFileName?: string;
  photoFileName?: string; // Assume you have a field for the animal's photo
}

// Define the props interface
interface AnimalDetailsProps {
  animalId: string; // Expecting animalId as a prop
  activeTab: number; // Tab index
  setActiveTab: React.Dispatch<React.SetStateAction<number>>; // Function to change the active tab
  setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>; // Function to change the active tab
}


const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
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

  // Ensure animalId is available before making a request
  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!animalId) return;
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

const handleBackBtnClick = () => {
  navigate('/dashboard/animals');
  setActiveTab(0);
  setSelectedAnimalId(null);
}

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

  const photoUrl = animalData.photoFileName
  ? API.Download() + `/animals/photos/${animalData.photoFileName}`
  : null;

  const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${animalData.videoFileName}`
    : null;

   console.log(API.User());

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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Fixed banner with animal photo and name */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mb: 2 }}>
        {photoUrl && (
          <img src={photoUrl} alt={animalData.animalName} style={{ width: '100%', height: 'auto' }} />
        )}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'blue', p: 2 }}>
          <Typography variant="h4">{animalData.animalName}</Typography>
        </Box>
      </Box>

      {/* Tabs for different sections */}
      <React.Fragment>

        <Tabs 
          value={tabValue} centered 
          onChange={handleTabChange} 
          variant='fullWidth'
          indicatorColor='secondary' 
          aria-label="animal details tabs">

          <Tab label="Information" />
          <Tab label="Media Uploaded" />
          <Tab label="Version" />
          <Tab label="Access Granted" />
        </Tabs>
      

      {/* Tab Content */}
      <Box sx={{ p: 10 }}>
        {tabValue === 0 && (
          <Typography variant="body1">Animal information {animalData.animalName} can go here.</Typography>

        )}
        
        {tabValue === 1 && (
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
      )}

        {tabValue === 2 && (
          <Typography variant="body1">Version history for {animalData.animalName} can go here.</Typography>
        )}
        {tabValue === 3 && (
          <Typography variant="body1">Access details for {animalData.animalName} can go here.</Typography>
        )}
      </Box>
      </React.Fragment>

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