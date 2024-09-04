import React from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import ModelRenderer from "./components/ModelRenderer";

interface ModelViewerProps {
    modelPath: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ( {modelPath} ) => {

    return (
        <Card variant="outlined" sx={{ minWidth: 400, height: '100%'}}>
            <CardContent>
                <ModelRenderer modelPath={modelPath}/>
            </CardContent>
        </Card>
    );
}

export default ModelViewer;