import React, {useContext, useEffect, useState} from 'react';

import { UserProfileContext } from "../Internals/ContextStore";
import API from "../Internals/API";

import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box} from "@mui/material";

const Animals: React.FC = () => {
  const userContext = useContext(UserProfileContext);

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

  return (
    <div>
      <h1>Animals</h1>
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                {animals && animals.map((animal: any, index: number) => {
                        return (
                        <Grid key={index}>
                            <AnimalCard animalName={animal.animalName} animalDOB={animal.animalDOB} animalType={animal.animalType}/>
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