import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";
import API from "../Internals/API";
import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box, Typography, Button, CircularProgress} from "@mui/material";
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
  const [loading, setLoading] = useState<boolean>(true);


  // Fetch animal IDs and details for the user
  const fetchAnimalsData = async () => {
    try {
      const animalAccessResponse = await fetch(API.Download() + `/user/${userId}/animalIDs`);
      if (animalAccessResponse.ok) {
        const animalIDs = await animalAccessResponse.json();
        const animalDetailsPromises = animalIDs.map(async (animalID: string) =>
          await fetch(API.Download() + `/animals/details/${animalID}`)
        );
        const animalDetailsResponses: any[] = [];
        for (const animalID of animalIDs) {
            animalDetailsResponses.push(await fetch(API.Download() + `/animals/details/${animalID}`).then(response => response.json()));
        }
        setAnimals(animalDetailsResponses);
        setLoading(false);
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
    return (
        <>
          <h1>Animals</h1>
          {loading ? (<CircularProgress/>) : null}
          <AnimalDetails animalId={selectedAnimalId} activeTab={activeTab} setActiveTab={setActiveTab} setSelectedAnimalId={setSelectedAnimalId}/>
        </>
    );
  }

  return (
      <Box display="flex" flexDirection="column" alignItems="center" paddingTop={2}>

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
