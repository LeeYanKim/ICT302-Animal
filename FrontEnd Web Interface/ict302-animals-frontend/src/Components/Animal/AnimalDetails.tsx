
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, CircularProgress, Button, Tabs, Tab, AppBar, Container, Grid2 as Grid} from "@mui/material";
import API from "../../Internals/API";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModelViewer from "../ModelViewer/ModelViewer";
import Generation from "../Generation/Generation";
import ReactPlayer from "react-player";
import FullFeaturedCrudGrid from './FullFeaturedCrudGrid'; 
import DataGridDemo from './History'; 
        
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
  const [refreshThumbnails, setRefreshThumbnails] = React.useState(false);

interface AnimalDetailsProps {
  animalId: string;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [PlayerOpen, setPlayerOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);


  const navigate = useNavigate();
  const location = useLocation();
  const animalNameFromState = location.state?.animalName;

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const togglePlayerClose = () => {
    setPlayerOpen(!PlayerOpen);
  };


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date of birth (DoB)
  const formatDOB = (dob: string) => {
    const date = new Date(dob);
    return date.toLocaleDateString(); // Format the date as MM/DD/YYYY (or according to the user's locale)
  };


  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  return (
    <Box sx={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
    
      {/* Fixed banner with animal photo and name */}
      <Box textAlign="center" sx={{ mt: 5 , pb: 3 }}>
        <Typography variant="h4">{animalData.animalName}</Typography>
        <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
        <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>
      </Box>

      {/* Tabs for different sections */}
      <AppBar position="sticky" color ='transparent' sx={{ width: '100%'}} >
        <Tabs value={tabValue} variant="fullWidth" indicatorColor="secondary" 
          textColor="inherit" onChange={handleTabChange} 
          aria-label="animal details tabs" 
          //sx={{ width: '100%' }}
          //</AppBar>sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
          sx={{ display: 'flex', flexGrow: 1 }}>
          <Tab label="Information" sx={{ flex: 1 }} />
          <Tab label="Media Uploaded" sx={{ flex: 1 }} />
          <Tab label="History" sx={{ flex: 1 }} />
          <Tab label="Access Granted" sx={{ flex: 1 }} />
        </Tabs>
      </AppBar>
    
      {/* Tab Content */}
      
      <Box sx={{ p: 5, width: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tabValue === 0 && (
        <Box sx={{ flex: 1 ,width: '100%'}}>
          <Typography variant="body1">Details about {animalData.animalName} can go here.</Typography>
            <Grid2 container spacing={0.5} rowSpacing={0.5} columns={15} columnSpacing={{ xs: 0.5, sm: 1, md: 2 }}>
              <Grid2 size={5}><Item>Name: </Item></Grid2>
              <Grid2 size={10}><Item>{animalData.animalName}</Item></Grid2>
              <Grid2 size={5}><Item>Type: </Item></Grid2>
              <Grid2 size={10}><Item>{animalData.animalType}</Item></Grid2>
              <Grid2 size={5}><Item>Date of Birth: </Item></Grid2>
              <Grid2 size={10}><Item>{new Date(animalData.animalDOB).toLocaleDateString()}</Item></Grid2>
            </Grid2>
        </Box>
        
        )}
        
        {tabValue === 1 && (
        <Box sx={{ flex: 1,width: '100%' }}>
          <Box>
            <Typography variant="body1">Media uploaded for {animalData.animalName}:</Typography>
            {videoUrl ? (
              <Box sx={{ flex: 1 ,width: '100%'}}>
              {/*<Box sx={{ marginTop: '20px' }}>*/}
                <video controls width="100%">
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
          <Box sx={{ flex: 1 ,width: '100%'}}>  {/* Set maxWidth here */}
          {/*<Box sx={{ flex: 1, maxWidth: '1000px' }}>  {/* Set maxWidth here */}
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
            
  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
          {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
  }

  return (
    <Box sx={{width: "1000px"}}>

      {/* Banner with animal photo and name */}
      <Box sx={{ position: 'relative', overflow: 'hidden', mb: 2 }}>
        {photoUrl && (
          <img src={photoUrl} alt={animalData.animalName} style={{ width: '100%', height: 'auto' }} />
        )}
        <Box sx={{}}>
          <Typography variant="h4">{animalData.animalName}</Typography>
        </Box>
      </Box>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
      </Box>


      {/* Tab Content */}
        <CustomTabPanel index={0} value={tabValue}>
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
        </CustomTabPanel>

        <CustomTabPanel index={1} value={tabValue}>
            <Typography variant="body1">Media uploaded for {animalData.animalName}:</Typography>
            {animalData.graphics && animalData.graphics.length > 0 ? (
                animalData?.graphics.map((graphic, index) => (
                    <Box key={graphic.gpcid} sx={{ marginTop: '20px' }}>
                      <Typography variant="subtitle1">Video {index + 1}:</Typography>
                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <ReactPlayer key={graphic.gpcid} width={'100%'} height={'100%'} url={graphic.filePath} controls={true} />
                        </Grid>
                        <Grid size={6}>
                          <Generation key={graphic.gpcid} graphicId={graphic.gpcid} animalId={animalId} graphicFileName={graphic.filePath}/>
                        </Grid>
                      </Grid>
                    </Box>
                ))
            ) : (
                <Typography>No video available for this animal.</Typography>
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
        <Box sx={{ flex: 1}}>
          <Typography variant="body1">Animal history for {animalData.animalName} can go here.</Typography>
          {/*<FullFeaturedCrudGrid /> {/* Render the DataGrid component here */}
          < DataGridDemo triggerRefresh={refreshThumbnails} />
        
        
        </Box>
        )}

        {tabValue === 3 && (
        <Box sx={{ flex: 1}}>
          <Typography variant="body1">Access details for {animalData.animalName} can go here.</Typography>
        </Box>
        )}
      </Box>

        </CustomTabPanel>

        <CustomTabPanel index={2} value={tabValue}>
          <Typography variant="body1">Version history for {animalData.animalName} can go here.</Typography>
        </CustomTabPanel>

        <CustomTabPanel index={3} value={tabValue}>
          <Typography variant="body1">Access details for {animalData.animalName} can go here.</Typography>
        </CustomTabPanel>


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
