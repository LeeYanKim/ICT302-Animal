import React from 'react';
import { useParams } from 'react-router-dom';
import AnimalDetails from './AnimalDetails';

const AnimalDetailsWrapper: React.FC<{ activeTab: number; setActiveTab: React.Dispatch<React.SetStateAction<number>> }> = ({ activeTab, setActiveTab }) => {
  const { animalId } = useParams<{ animalId: string }>();

  if (!animalId) {
    return <div>No animal ID found</div>;
  }

  return <AnimalDetails animalId={animalId} activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default AnimalDetailsWrapper;