import React from 'react';
import {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Grid2, Box } from "@mui/material";
import API from '../../Internals/API';

interface HistoryContentProps {
  triggerRefresh: boolean;
}

interface AnimalModel {
  animalID: string;
  modelGenDate: Date;
  modelType: string;
  modelPlayer?: string; 
};

const History : React.FC<HistoryContentProps> = (triggerRefresh) => {
  const {animalId } = useParams<{ animalId: string }>(); // Extract animalId from the URL
  const [animalData, setAnimalData] = useState<AnimalModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [animalTypes, setAnimalTypes] = useState<string[]>([]);

    // Ensure animalId is available before making a request
    useEffect(() => {
      if (!animalId) return;

      const fetchAnimalData = async () => {
        try {
          // Use the correct endpoint for fetching animal details
          const response = await fetch(API.Download() + `animals/details/${animalId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch animal data");
          }
          const data = await response.json();
          setAnimalData(data);
        } catch (error) {
          console.error("Error fetching animal data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAnimalData();
    }, [animalId,triggerRefresh]);

    if (loading) {
      return <div>Loading...</div>;
    }

    // Access the modelPlayer from the first animal model (if applicable)
    const modelPlayer = animalData.length > 0 ? animalData[0].modelPlayer : null;
    const modelUrl = modelPlayer ? API.Download() + `/dashboard/animals/${animalId}/${modelPlayer}` : null;

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 40 },
    {
      field: 'date_gen',
      headerName: 'Generated Date',
      type: 'date',
      width: 150,
      editable: false,
    },
    {
      field: 'model_type',
      headerName: 'Model Type',
      width: 130,
      editable: false,
      valueOptions: ['Mesh', 'Nurbs', 'Volumetric','Rigged','low-polygons'],
    },
    { field: 'model_view', 
      headerName: '3D Model', 
      width: 160,
      editable: true 
    }
  ];

  const rows = [
    { id: 1, date_gen: new Date(), model_type: 'Mesh', model_view: 14 },
    { id: 2, date_gen: new Date(), model_type: 'Nurbs', model_view: 31 },
    { id: 3, date_gen: new Date(), model_type: 'Volumetric', model_view: 31 },
    { id: 4, date_gen: new Date(), model_type: 'Rigged', model_view: 11 },
    { id: 5, date_gen: new Date(), model_type: 'Mesh', model_view: null },
    { id: 6, date_gen: new Date(), model_type: null, model_view: 150 },
    { id: 7, date_gen: new Date(), model_type: 'Ferrara', model_view: 44 },
    { id: 8, date_gen: new Date(), model_type: 'Mesh', model_view: 36 },
    { id: 9, date_gen: new Date(), model_type: 'low-polygons', model_view: 65 },
  ];


  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};
export default History;