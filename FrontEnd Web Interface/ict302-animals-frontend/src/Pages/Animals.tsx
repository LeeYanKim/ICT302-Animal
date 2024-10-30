import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";
import API from "../Internals/API";
import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box, Typography, Button, CircularProgress} from "@mui/material";
import AnimalsGrid from '../Components/Animal/AnimalGrid';
import AnimalDetails from "../Components/Animal/AnimalDetails"; // Adjust import based on your structure
import {Animal} from "../Components/Animal/AnimalInterfaces";

interface AnimalProps {
  actTab: number; // Tab index
}

const Animals: React.FC<AnimalProps> = ({actTab}) => {
  const frontendContext = useContext(FrontendContext);
  const userAnimals = frontendContext.user.contextRef.current.userAnimals;
  const userId = frontendContext.user.contextRef.current.userId; // Get userId from context
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[] >(userAnimals);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(actTab); // 0 for AnimalGrid, 1 for AnimalDetails
  const [loading, setLoading] = useState<boolean>(true);

  // Get current animal data from the context
  const fetchAnimalsData = async () => {
    const animalData = frontendContext.user.contextRef.current.userAnimals;
    setAnimals(animalData);
    setLoading(false);
  };

  useEffect(() => {
    if (userId)
    {
      fetchAnimalsData();
    }
  },[]);

  // Define the handleAnimalClick function
  const handleAnimalClick = (animalID: string) => {
    setSelectedAnimalId(animalID);
    setActiveTab(1); // Switch to AnimalDetails view
    navigate(`/dashboard/animals/${animalID}`); // Navigate to details page
  };

  const AnimalGridContent = () => {
    return (
        <>
          <h1>Animals</h1>
          {loading ? (<CircularProgress/>) : null}
          <AnimalsGrid triggerRefresh={true} onAnimalClick={handleAnimalClick}/>
        </>
    );
  }

  const AnimalDetailsContent = () => {
    return (<AnimalDetails animalId={selectedAnimalId} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedAnimalId={setSelectedAnimalId}/>);
  }

  //TODO: Reset selected tab when navigating to animals page from animal details
  return (
      <Box display="flex" flexDirection="column" alignItems="center" paddingTop={2}>

        {loading ? (<CircularProgress/>) : null}

        {(animals.length > 0 && activeTab) === 0 && (
            <AnimalGridContent />
        )}

      {(animals.length > 0 && activeTab === 1 && selectedAnimalId) && (
        <AnimalDetailsContent />
      )}

      {animals.length === 0 && (
        <Box sx={{ width: '100%'}}>
          <Typography variant="h6">No animals found</Typography>
          <Button variant="contained" color="secondary" onClick={fetchAnimalsData}>Reload</Button>
        </Box>
        )}
    </Box>
  );
}

export default Animals;
