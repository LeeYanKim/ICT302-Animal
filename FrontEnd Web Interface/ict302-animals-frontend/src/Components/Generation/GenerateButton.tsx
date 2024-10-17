import React, { useEffect, useState } from "react";
import {Box, Button, Typography } from "@mui/material";
import ModelViewer from "../ModelViewer/ModelViewer";

export default function GenerateButton() {
    const[showModelViewer, setShowModelViewer] = useState(false);
    const modelPath = "/3d_test_files/horse_walk.glb"; //will obvs have to change
 

    const handleClick = () => {
        setShowModelViewer(true);
    }

  return (
    <>
    {!showModelViewer ?
    (
    <Button onClick = {handleClick}>
        Generate From this Video
    </Button>
    ) : (<></>)}



    {showModelViewer && (
        <Box>
          {/* Text at the top */}
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Generated Video:
          </Typography>

          {/* ModelViewer component below the text */}
          <ModelViewer modelPath={modelPath} />
        </Box>
      )}
    </>
  );
}
