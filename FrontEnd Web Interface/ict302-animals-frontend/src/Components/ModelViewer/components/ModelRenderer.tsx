import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

import Controls from "./Controls";
import Scene from './Scene';
import Model from './Model';
import { OrbitControls, CameraControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';

interface ModelRendererProps {
    modelPath: string;
}

const ModelRenderer: React.FC<ModelRendererProps> = ({ modelPath }) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [isWireframe, setIsWireframe] = useState(false);

    const handlePlayPause = () => {
      setIsAnimating(!isAnimating);
    };


    return (
        <div>
            <Scene>
                <Model url={modelPath} isAnimating={isAnimating} wireframe={isWireframe} />
            </Scene>
            
            <Controls isAnimating={isAnimating} toggleWireframe={isWireframe}/>
        </div>
    );
}

export default ModelRenderer;