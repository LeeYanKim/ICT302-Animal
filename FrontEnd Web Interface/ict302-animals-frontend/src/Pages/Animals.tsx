import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";

import API from "../Internals/API";

import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box} from "@mui/material";
import AnimalsGrid from '../Components/Animal/AnimalGrid';
import AnimalDetails from "../Components/Animal/AnimalDetails"; // Adjust import based on your structure

interface AnimalProps {
  actTab: number; // Tab index
}

const Animals: React.FC<AnimalProps> = ({actTab}) => {
  const frontendContext = useContext(FrontendContext);
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<[]>([]);
  //below two lines are newly added
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(actTab); // 0 for AnimalGrid, 1 for AnimalDetails

  const handelDBConnectionTest = async () => {
    try {
      const response = await fetch(API.Animals());
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
        console.log(animals);
      } else {
        console.error('Failed to fetch animals data');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handelDBConnectionTest();
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
        <h1>Animals test here</h1>
        {/* Sidebar component can be added here */}
        
        {activeTab === 0 && (
        <AnimalsGrid triggerRefresh={true} onAnimalClick={handleAnimalClick} />
      )}

      {activeTab === 1 && selectedAnimalId && (
        <AnimalDetails animalId={selectedAnimalId} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedAnimalId={setSelectedAnimalId}/>
      )}
      </Box>
  );
}

export default Animals;
