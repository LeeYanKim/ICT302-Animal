import React, {useContext, useEffect, useState} from 'react';


import { useNavigate } from 'react-router-dom';
import { FrontendContext } from "../Internals/ContextStore";

import API from "../Internals/API";

import AnimalCard from "../Components/Animal/AnimalCard";
import CompletedCard from "../Components/Completed/CompletedCard";
import {Grid2 as Grid, Box} from "@mui/material";
import AnimalsGrid from '../Components/Animal/AnimalGrid';

const Animals: React.FC = () => {
  const userContext = useContext(FrontendContext);
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<[]>([]);

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
  }, []);

  return (
    <div>
      <h1>Animals</h1>
      {/* Render RecentlyUploaded to display animals */}
      <AnimalsGrid triggerRefresh={true} />
    </div>
  );
}

export default Animals;
