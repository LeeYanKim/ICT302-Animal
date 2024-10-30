import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

import Controls from "./Controls";
import Scene from './Scene';
import Model from './Model';
import { OrbitControls, CameraControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';

import {Stack} from '@mui/material';

interface ModelRendererProps {
    modelPath: string | undefined;
}

const ModelRenderer: React.FC<ModelRendererProps> = ({ modelPath }) => {
    // Control states between the model and the viewer controls
    const [isAnimating, setIsAnimating] = useState(true);
    const [isWireframe, setIsWireframe] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [isLooping, setIsLooping] = useState(true);
    const [animationSpeed, setAnimationSpeed] = useState(1.0);
    const [isSkeleton, setIsSkeleton] = useState(false);
    const [animationPosition, setAnimationPosition] = useState(0)
    const [animationMaxPos, setAnimationMaxPos] = useState(0);


    return (
        <Stack>
            <Scene>
                <Model url={modelPath} isAnimating={isAnimating} wireframe={isWireframe}
                       animationSpeed={animationSpeed} isLooping={isLooping} isRotating={isRotating}
                       isSkeleton={isSkeleton} animationPosition={animationPosition}
                       setAnimationPosition={setAnimationPosition} animationMaxPos={animationMaxPos}
                       setAnimationMaxPos={setAnimationMaxPos}/>
            </Scene>
            <Controls
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
                toggleWireframe={isWireframe}
                setToggleWireframe={setIsWireframe}
                isSkeleton={isSkeleton}
                isRotating={isRotating}
                animationSpeed={animationSpeed}
                isLooping={isLooping}
                setAnimationSpeed={setAnimationSpeed}
                setIsLooping={setIsLooping}
                setIsRotating={setIsRotating}
                setIsSkeleton={setIsSkeleton}
                animationPosition={animationPosition}
                animationMaxPos={animationMaxPos}
            />
        </Stack>
    );
}

export default ModelRenderer;