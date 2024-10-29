import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, CircularProgress, Button, Tabs, Tab, Grid2 as Grid} from "@mui/material";
import API from "../../Internals/API";
import { useLocation, useNavigate } from 'react-router-dom';
import ModelViewer from "../ModelViewer/ModelViewer";
import Generation from "../Generation/Generation";
import ReactPlayer from "react-player";

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
