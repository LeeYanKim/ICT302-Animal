import React, { ReactNode, useEffect, useRef, createRef, Suspense } from 'react';
import { Canvas, useThree  } from '@react-three/fiber';
import { OrbitControls, CameraControls, ContactShadows, PerspectiveCamera, Html, useProgress} from '@react-three/drei';
import {Group, Object3DEventMap} from 'three';
import { stat } from 'fs';


interface SceneProps {
  children: ReactNode;  // Accepts any React component as children
}

//style={{ width: '100%', height: '90vh' }}

const Scene: React.FC<SceneProps> = ({ children }) => {

function Loader() {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
  }
// position={[0, 1, 5]} <PerspectiveCamera makeDefault fov={75}/>
  return (
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <OrbitControls enableZoom={true} />
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
    </Canvas>
  );
};


export default Scene;
