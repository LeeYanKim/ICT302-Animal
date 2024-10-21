import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, Tabs, Tab } from "@mui/material";
import API from "../../Internals/API"; 
import { useNavigate } from 'react-router-dom';

interface Graphic {
  gpcid: string;
  gpcName: string;
  gpcDateUpload: string;
  filePath: string;
  animalID: string;
}

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  graphics: Graphic[]; // Updated to include media files as graphics array
  photoFileName?: string;
}

interface AnimalDetailsProps {
  animalId: string;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

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
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  const handleBackBtnClick = () => {
    navigate('/dashboard/animals');
    setActiveTab(0);
    setSelectedAnimalId(null);
  };

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

  // URLs for photo
  const photoUrl = animalData.photoFileName
    ? API.Download() + `/animals/photos/${animalData.photoFileName}`
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

  // Format date of birth (DoB)
  const formatDOB = (dob: string) => {
    const date = new Date(dob);
    return date.toLocaleDateString(); // Format the date as MM/DD/YYYY (or according to the user's locale)
  };

  return (
    <Box>
      {/* Banner with animal photo and name */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mb: 2 }}>
        {photoUrl && (
          <img src={photoUrl} alt={animalData.animalName} style={{ width: '100%', height: 'auto' }} />
        )}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'blue', p: 2 }}>
          <Typography variant="h4">{animalData.animalName}</Typography>
        </Box>
      </Box>

      {/* Tabs for different sections */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered 
        variant='fullWidth' 
        indicatorColor='secondary'
        aria-label="animal details tabs"
      >
        <Tab label="Information" />
        <Tab label="Media Uploaded" />
        <Tab label="Version" />
        <Tab label="Access Granted" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ p: 10 }}>
        {tabValue === 0 && (
          <Box>
            <Typography variant="h5">Animal Information:</Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {animalData.animalName}
            </Typography>
            <Typography variant="body1">
              <strong>Type:</strong> {animalData.animalType}
            </Typography>
            <Typography variant="body1">
              <strong>Date of Birth:</strong> {formatDOB(animalData.animalDOB)}
            </Typography>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="body1">Media uploaded for {animalData.animalName}:</Typography>
            {animalData.graphics && animalData.graphics.length > 0 ? (
              animalData.graphics.map((graphic, index) => (
                <Box key={graphic.gpcid} sx={{ marginTop: '20px' }}>
                  <Typography variant="subtitle1">Video {index + 1}:</Typography>
                  <video
                    controls
                    style={{
                      width: '600px', // Fixed width
                      height: '340px', // Fixed height to maintain aspect ratio
                      objectFit: 'cover', // Ensures the video covers the entire space while maintaining aspect ratio
                      backgroundColor: 'black', // Background in case of empty space
                    }}
                  >
                    <source src={graphic.filePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              ))
            ) : (
              <Typography>No video available for this animal.</Typography>
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
