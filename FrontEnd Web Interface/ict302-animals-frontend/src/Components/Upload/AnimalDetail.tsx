import React, { useEffect, useState } from "react";

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  videoFileName?: string;
}

interface AnimalDetailsProps {
  animalID: string;
}

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ animalID }) => {
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        // Use the correct endpoint for fetching animal details
        const response = await fetch(`http://localhost:5173/api/files/animals/details/${animalID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data = await response.json();
        setAnimal(data);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      }
    };

    fetchAnimalData();
  }, [animalID]);

  if (!animal) {
    return <div>Loading...</div>;
  }

  const videoUrl = animal.videoFileName
    ? `http://localhost:5173/api/files/animals/videos/${animal.videoFileName}`
    : null;

  return (
    <div>
      <h2>{animal.animalName}</h2>
      <p>Type: {animal.animalType}</p>
      <p>Date of Birth: {new Date(animal.animalDOB).toLocaleDateString()}</p>

      {/* Video Player */}
      {videoUrl ? (
        <video controls width="600">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No video available.</p>
      )}
    </div>
  );
};

export default AnimalDetails;
