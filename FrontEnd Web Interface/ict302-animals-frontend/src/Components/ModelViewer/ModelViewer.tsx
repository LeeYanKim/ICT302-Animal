import React from "react";


import ModelRenderer from "./components/ModelRenderer";

interface ModelViewerProps {
    modelPath: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ( {modelPath} ) => {

    return (
        <div>
            <ModelRenderer modelPath={modelPath}/>
        </div>
    );
}

export default ModelViewer;