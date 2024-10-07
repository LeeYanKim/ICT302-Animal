// ParentComponent.tsx
import React, { useState } from "react";
import NewAnimal from "./NewAnimal";
import { Button } from "@mui/material";

const ParentComponent: React.FC = () => {
  const [isNewAnimalDialogOpen, setIsNewAnimalDialogOpen] = useState<boolean>(false);

  const handleAddNewAnimal = (animalDetails: {
    animalName: string;
    animalType: string;
    dateOfBirth: string;
    file: File;
  }) => {
    const { animalName, animalType, dateOfBirth, file } = animalDetails;

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file);
    formData.append("animalName", animalName);
    formData.append("animalType", animalType);
    formData.append("dateOfBirth", dateOfBirth);

    // Perform the upload
    fetch("http://localhost:5173/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Handle success
          alert("Animal added successfully!");
          // Refresh the list or perform other actions
        } else {
          // Handle error
          response.json().then((data) => {
            alert(`Error: ${data.message}`);
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file.");
      });
  };

  return (
    <>
      {/* Other content */}
      <Button
        onClick={() => setIsNewAnimalDialogOpen(true)}
        variant="contained"
        color="primary"
      >
        Add New Animal
      </Button>
      <NewAnimal
        open={isNewAnimalDialogOpen}
        handleClose={() => setIsNewAnimalDialogOpen(false)}
        addNewAnimal={handleAddNewAnimal}
      />
    </>
  );
};

export default ParentComponent;
