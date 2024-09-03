import React from "react";


import ModelRenderer from "./components/ModelRenderer";

export default function ModelViewer() {

    const modelPath = "/3d_test_files/horse_walk.glb";

    return (
        <div>
            <ModelRenderer modelPath={modelPath}/>
        </div>
    );
}