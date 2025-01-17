import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useContext} from "react";
import {FrontendContext} from "../../Internals/ContextStore";
import { Box, Typography, CircularProgress, Button, Tabs, Tab, Grid2 as Grid, Paper, MenuList, MenuItem, ListItemText, ListItemIcon, Divider, Alert } from "@mui/material";
import API from "../../Internals/API";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModelViewer from "../ModelViewer/ModelViewer";
import Generation from "../Generation/Generation";
import ReactPlayer from "react-player";
import FullFeaturedCrudGrid from './FullFeaturedCrudGrid'; 
import DataGridDemo from './History';
import DeleteGraphicButton from "./DeleteGraphicButton";
import {Graphic, Animal, AnimalDetailsProps} from './AnimalInterfaces';
import GraphicOptionsMenu from "./GraphicOptionsMenu";
import { ErrorBoundary } from "react-error-boundary";
import {AccessTime, Folder} from "@mui/icons-material";
import AnimalMediaViewer from "./AnimalMediaViewer";

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalId, activeTab, setActiveTab, setSelectedAnimalId }) => {
  const frontendContext = useContext(FrontendContext);
  const selectedAnimal = frontendContext.user.contextRef.current.userAnimals.find(a => a.animalID === animalId);
  const [animalData, setAnimalData] = useState<Animal | null>(selectedAnimal ? selectedAnimal : null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const animalNameFromState = location.state?.animalName;

  const [backBtnClicked, setBackBtnClicked] = useState(false);
  const [refreshThumbnails, setRefreshThumbnails] = React.useState(false);


  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!animalId) return;
      try {
        const response = await fetch(API.Download() + `/animals/details/${animalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data = await response.json();
        //setAnimalData(data);
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
    : `/assets/images/fallback/${animalData.animalType.toLowerCase()}.png`;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date of birth (DoB)
  const formatDOB = (dob: string) => {
    const date = new Date(dob);
    return date.toLocaleDateString(); // Format the date as DD/MM/YYYY (or according to the user's locale)
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


  const convertBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  //flex: 1,  display: 'flex', flexDirection: 'column', gap: 3
  return (
        <Box sx={{width: '100%'}}>

          {/* Banner with animal photo and name */}
          <Grid container spacing={2} sx={{ flexGrow: 1,  position: 'relative', overflow: 'hidden', mb: 2 }}>
            <Grid>
              {photoUrl && (
                  <img src={photoUrl} alt={animalData.animalName} style={{ width: '60px', height: '60px', borderRadius: '6px' }} />
              )}
            </Grid>
            <Grid sx={{height: '60px'}} display={'inline'}>
              <Typography variant="h4">{animalData.animalName}</Typography>
            </Grid>
          </Grid>

          {/* Tabs for different sections */}
          <Box sx={{flexGrow: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              variant='fullWidth'
              indicatorColor='secondary'
              aria-label="animal details tabs"
              textColor="inherit"
              sx={{ display: 'flex', flexGrow: 1 }}
            >
              <Tab label="Information" sx={{ flex: 1 }}/>
              <Tab label="Media Uploaded" sx={{ flex: 1 }}/>
              <Tab label="History" sx={{ flex: 1 }}/>
              <Tab label="Access Granted" sx={{ flex: 1 }}/>
            </Tabs>
          </Box>

          <Box sx={{ p: 5, width: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Tab Content */}
            <CustomTabPanel index={0} value={tabValue}>
              <Box sx={{ flex: 1 ,width: '100%'}}>
                <Grid container spacing={0.5} rowSpacing={0.5} columns={15} columnSpacing={{ xs: 0.5, sm: 1, md: 2 }}>
                  <Grid size={{xs: 5}}>
                    <Typography variant="body1">
                      <strong>Type:</strong>
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 10}}>
                    <Typography variant="body1">
                      {animalData.animalType}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 5}}>
                    <Typography variant="body1">
                      <strong>Date of Birth:</strong>
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 10}}>
                    <Typography variant="body1">
                      {formatDOB(animalData.animalDOB)}
                    </Typography>
                  </Grid>
                </Grid>

              </Box>
            </CustomTabPanel>

            <CustomTabPanel index={1} value={tabValue}>
              <Box sx={{ flex: 1, width: '100%' }}>
                {animalData.graphics && animalData.graphics.length > 0 ? (
                  animalData.graphics.map((graphic, index) => {
                    const isImage = /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(graphic.filePath); // Check if file is an image
                    return (
                      <Box key={graphic.gpcid} sx={{ marginTop: '20px' }}>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '20px'}}>
                          <Typography sx={{display: 'inline'}} variant="subtitle1">Media {index + 1}</Typography>
                          <GraphicOptionsMenu graphic={graphic} />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid size={'grow'}>
                            <ErrorBoundary fallback={<Typography>There was an error loading the media</Typography>}>
                              <AnimalMediaViewer key={graphic.gpcid} graphicId={graphic.gpcid} graphicFilePath={graphic.filePath} isImage={isImage} uploadedDate={graphic.gpcDateUpload} fileSize={convertBytes(graphic.gpcSize)}/>
                            </ErrorBoundary>

                          </Grid>
                          <Grid size={'grow'}>
                            <ErrorBoundary fallback={<Typography>There was an error loading the media</Typography>}>
                              <Generation key={graphic.gpcid} graphicId={graphic.gpcid} animalId={animalId!} graphicFileName={graphic.filePath} />
                            </ErrorBoundary>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>No media available for this animal.</Typography>
                )}
              </Box>
            </CustomTabPanel>


            <CustomTabPanel index={2} value={tabValue}>
              <Box sx={{ flex: 1}}>
                <Alert severity={'info'} variant="filled">This section is for future iterations</Alert>
              </Box>
            </CustomTabPanel>

            <CustomTabPanel index={3} value={tabValue}>
              <Alert severity={'info'} variant="filled">This section is for future iterations</Alert>
            </CustomTabPanel>

            {/* Back Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Button variant="contained" onClick={handleBackBtnClick}>
                Back to Animals
              </Button>
            </Box>
          </Box>
        </Box>
  );
 
  
};

export default AnimalDetails;
