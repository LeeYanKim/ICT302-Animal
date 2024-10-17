// AnimalDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Divider, AppBar, Tabs, Tab } from "@mui/material";
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
  photoFileName?: string; // Assume you have a field for the animal's photo
  graphics: GraphicData[];
}

// Define the props interface
interface AnimalDetailsProps {
  animalId: string; // Expecting animalId as a prop
  activeTab: number; // Tab index
  setActiveTab: React.Dispatch<React.SetStateAction<number>>; // Function to change the active tab
  setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>; // Function to change the active tab
}


const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
  const { animalId } = useParams<{ animalId: string }>();
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
    const fetchAnimalData = async () => {
      if (!animalId) return;
      try {
        const response = await fetch(API.Download() + `/animals/details/${animalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data: Animal = await response.json();

        // Handle $id and $ref if ReferenceHandler.Preserve is used
        // Remove $id and $ref properties from the data
        const cleanedData = JSON.parse(JSON.stringify(data));

        setAnimalData(cleanedData);
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

  const photoUrl = animalData.photoFileName
  ? API.Download() + `/animals/photos/${animalData.photoFileName}`
  : null;

  const videoUrl = animalData.videoFileName
    ? API.Download() + `/animals/videos/${animalData.videoFileName}`
    : null;

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
          {/* Display videos */}
      <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {animalData.graphics && animalData.graphics.length > 0 ? (
          animalData.graphics.map((graphic) => (
            <div key={graphic.gpcID} style={{ marginBottom: '20px' }}>
              <h4>{graphic.gpcName}</h4>
              <video controls width="600">
                <source src={`${API.Graphic()}/graphics/videos/${graphic.gpcID}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          ))
        )
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
