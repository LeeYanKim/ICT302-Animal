import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";

import API from "../Internals/API";

import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box, Typography, Button} from "@mui/material";
import AnimalsGrid from '../Components/Animal/AnimalGrid';
import AnimalDetails from "../Components/Animal/AnimalDetails"; // Adjust import based on your structure

interface AnimalProps {
  actTab: number; // Tab index
}

const Animals: React.FC<AnimalProps> = ({actTab}) => {
  const frontendContext = useContext(FrontendContext);
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<any[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(actTab); // 0 for AnimalGrid, 1 for AnimalDetails
  const userId = frontendContext.user.contextRef.current.userId; // Get userId from context




  // Fetch animal IDs and details for the user
  const fetchAnimalsData = async () => {
    try {
      const animalAccessResponse = await fetch(API.Download() + `/user/${userId}/animalIDs`);
      if (animalAccessResponse.ok) {
        const animalIDs = await animalAccessResponse.json();
        console.log(animalIDs);
        // Fetch details for each animal ID
        const animalDetailsPromises = animalIDs.map((animalID: string) =>
          fetch(API.Download() + `/animals/details/${animalID}`)
        );
        const animalDetailsResponses = await Promise.all(animalDetailsPromises);
        const animalsData = await Promise.all(
          animalDetailsResponses.map(response => response.json())
        );
        
        setAnimals(animalsData);
      } else {
        console.error('Failed to fetch animals data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAnimalsData(); // Fetch animals when userId is available
    }
  }, [activeTab, userId]);

  // Define the handleAnimalClick function here
  const handleAnimalClick = (animalId: string) => {
    console.log('Navigating to animalID:', animalId);
    setSelectedAnimalId(animalId);
    setActiveTab(1); // Switch to AnimalDetails view
    navigate(`/dashboard/animals/${animalId}`); // Navigate to details page
  };

  return (
    <Box>
        <h1>Animals</h1>
        
        {animals.length > 0 && activeTab === 0 && (
        <AnimalsGrid triggerRefresh={true} onAnimalClick={handleAnimalClick} />
      )}

      {animals.length > 0 && activeTab === 1 && selectedAnimalId && (
        <AnimalDetails animalId={selectedAnimalId} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedAnimalId={setSelectedAnimalId}/>
      )}
      
      {animals.length === 0 && (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
          <Typography variant="h6">No animals found</Typography>
          <Button variant="contained" color="secondary" onClick={fetchAnimalsData}>Reload</Button>
        </Box>
        )}
    </Box>
  );
}

export default Animals;
