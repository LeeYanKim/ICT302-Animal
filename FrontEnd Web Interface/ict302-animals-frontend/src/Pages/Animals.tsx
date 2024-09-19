import React, {useContext, useEffect} from 'react';

import { UserProfileContext } from "../Internals/ContextStore";
import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box} from "@mui/material";

const Animals: React.FC = () => {
  const userContext = useContext(UserProfileContext);

  let animals: any[] = [];

    const handelDBConnectionTest = async () => {
        try {
            const response = await fetch('http://10.51.33.25:5000/api/db/animals');
            const data = await response.json();

            animals = data;
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
        {animals.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <AnimalCard animalName={item.animalName} animalDOB={item.animalDOB} animalType={item.animalType}/>
            </Grid>
        ))
        }
            </Grid>
        </Box>
    </div>
  );
}


export default Animals;