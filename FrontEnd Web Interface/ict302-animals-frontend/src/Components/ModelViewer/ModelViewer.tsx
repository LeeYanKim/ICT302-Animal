import React from "react";

import {Card, CardContent} from '@mui/material';

import ModelRenderer from "./components/ModelRenderer";

interface ModelViewerProps {
    modelPath: string | undefined;
}

const ModelViewer: React.FC<ModelViewerProps> = ( {modelPath} ) => {

    return (
        <Card variant="outlined">
            <ModelRenderer modelPath={modelPath}/>
        </Card>
    );
}

export default ModelViewer;