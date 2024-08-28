import React, { ReactNode, useEffect, useRef } from 'react';
import { Canvas, useThree  } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import './Scene.css';

interface SceneProps {
  children: ReactNode;  // Accepts any React component as children
}

const Scene: React.FC<SceneProps> = ({ children }) => {
  return (
    <Canvas
        camera={{ position: [0, 1, 5], fov: 75 }}
        style={{ width: '100%', height: '90vh' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={true} />
        {children}
    </Canvas>
  );
};


export default Scene;
