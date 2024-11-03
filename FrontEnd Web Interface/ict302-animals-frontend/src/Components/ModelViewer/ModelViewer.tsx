import React from "react";

import {Card, CardContent, Box} from '@mui/material';

import ModelRenderer from "./components/ModelRenderer";
import Typography from "@mui/material/Typography";

interface ModelViewerProps {
    modelPath: string | undefined;
}

const ModelViewer: React.FC<ModelViewerProps> = ( {modelPath} ) => {

    return (
        <Box>
        {modelPath && modelPath !== "" ? (
        <Card variant="outlined">
            <ModelRenderer modelPath={modelPath}/>
        </Card>
        )
        :
        (
        <CardContent>
            <Typography>No model selected.</Typography>
        </CardContent>
        )}
        </Box>
    );
}

export default ModelViewer;