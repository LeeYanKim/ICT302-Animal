// AnimalDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import API from "../../Internals/API";

interface GraphicData {
  gpcID: string;
  gpcName: string;
  gpcDateUpload: string;
  filePath: string;
  animalID: string;
  gpcSize: number;
}

interface Animal {
  animalID: string;
  animalName: string;
  animalType: string;
  animalDOB: string;
  graphics: GraphicData[];
}

const AnimalDetails: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [animalData, setAnimalData] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!animalId) return;

    const fetchAnimalData = async () => {
      try {
        const response = await fetch(API.Download() + `/animals/details/${animalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch animal data");
        }
        const data: Animal = await response.json();

        // Handle $id and $ref if ReferenceHandler.Preserve is used
        // Remove $id and $ref properties from the data
        const cleanedData = JSON.parse(JSON.stringify(data));

        setAnimalData(cleanedData);
      } catch (error) {
        console.error("Error fetching animal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!animalData) {
    return <div>No animal data available.</div>;
  }

  return (
    <Box textAlign="center" sx={{ mt: 5 }}>
      <Typography variant="h4">{animalData.animalName}</Typography>
      <Typography variant="subtitle1">Type: {animalData.animalType}</Typography>
      <Typography variant="subtitle2">DOB: {new Date(animalData.animalDOB).toLocaleDateString()}</Typography>

      {/* Display videos */}
      <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {animalData.graphics && animalData.graphics.length > 0 ? (
          animalData.graphics.map((graphic) => (
            <div key={graphic.gpcID} style={{ marginBottom: '20px' }}>
              <h4>{graphic.gpcName}</h4>
              <video controls width="600">
                <source src={`${API.Graphic()}/graphics/videos/${graphic.gpcID}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          ))
        ) : (
          <Typography>No videos available.</Typography>
        )}
      </Box>

      <Box mt={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" onClick={() => navigate('/dashboard/animals/')}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default AnimalDetails;
