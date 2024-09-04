import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

import Controls from "./Controls";
import Scene from './Scene';
import Model from './Model';
import { OrbitControls, CameraControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';

import {Stack} from '@mui/material';

interface ModelRendererProps {
    modelPath: string;
}

const ModelRenderer: React.FC<ModelRendererProps> = ({ modelPath }) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [isWireframe, setIsWireframe] = useState(false);

    return (
        <div>
            <Stack direction="column" spacing={2}>
                <Scene>
                    <Model url={modelPath} isAnimating={isAnimating} wireframe={isWireframe} />
                </Scene>
                
                <Controls isAnimating={isAnimating} setIsAnimating={setIsAnimating} toggleWireframe={isWireframe} setToggleWireframe={setIsWireframe}/>
            </Stack>
        </div>
    );
}

export default ModelRenderer;