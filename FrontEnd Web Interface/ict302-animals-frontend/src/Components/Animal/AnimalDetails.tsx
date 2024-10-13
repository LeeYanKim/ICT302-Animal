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
//const AnimalDetails: React.FC = () => {
  //const { animalId } = useParams<{ animalId: string }>();
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [backBtnClicked, setBackBtnClicked] = useState(false);

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
