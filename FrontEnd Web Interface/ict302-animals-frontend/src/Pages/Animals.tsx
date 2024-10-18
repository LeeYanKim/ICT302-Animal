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
  const [animals, setAnimals] = useState<[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(actTab); // 0 for AnimalGrid, 1 for AnimalDetails

  const fetchAnimalsData = async () => {
    try {
      const response = await fetch(API.Animals());
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
      } else {
        console.error('Failed to fetch animals data');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAnimalsData();
  }, [activeTab]);

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
