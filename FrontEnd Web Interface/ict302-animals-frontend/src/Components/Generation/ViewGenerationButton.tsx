import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ModelViewer from "../ModelViewer/ModelViewer";

export default function ViewGenerateButton() {
  const [showModelViewer, setShowModelViewer] = useState(false);


  const modelPath = "/3d_test_files/horse_walk.glb"; //will obvs have to change


  const ToggleViewer = () => {
    if (showModelViewer) {
      setShowModelViewer(false);
    } else {
      setShowModelViewer(true);
    }

  }

  return (
    <>
      {!showModelViewer ?
        (
          <Button component="label"
            variant="contained" onClick={ToggleViewer}>
            View the Generation from this Video
          </Button>
        ) : (
          <Button component="label"
            variant="contained" onClick={ToggleViewer}>
            Close Generation
          </Button>)}



      {showModelViewer && (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Generated Video:
          </Typography>
          <ModelViewer modelPath={modelPath} />
        </Box>
      )}
    </>
  );
}
