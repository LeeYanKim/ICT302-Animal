import React, {useContext, useEffect, useState} from 'react';


import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";

import API from "../Internals/API";

import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box} from "@mui/material";

const Animals: React.FC = () => {
  const frontendContext = useContext(FrontendContext);

  const navigate = useNavigate();  
  const [animals, setAnimals] = useState<[]>([]);

    const handelDBConnectionTest = async () => {
        try {
            const response = await fetch(API.Animals());
            const data = await response.json();
            setAnimals([]);
            setAnimals(data);
            console.log(animals);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handelDBConnectionTest();
    }, []);

    //func to handle opening new page of animal
  const handleCardClick = (animalId: string) => {
    navigate(`/dashboard/animals/${animalId}`);  // Navigate to the animal details page using the animalId
  };

  return (
    <div>
      <h1>Animals</h1>
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme: { spacing: (arg0: number) => any; }) => theme.spacing(2) }}
            >
                {animals && animals.map((animal: any, index: number) => {
                        return (
                        <Grid key={index}>
                            <AnimalCard animalName={animal.animalName} animalDOB={animal.animalDOB} animalType={animal.animalType}  onClick={() => handleCardClick(animal.animalId)}/>
                        </Grid>
                        )
                    })
                }
            </Grid>
        </Box>
    </div>
  );
}


export default Animals;
