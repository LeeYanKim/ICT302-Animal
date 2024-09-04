import React, { ReactNode, useEffect, useRef, createRef, Suspense } from 'react';
import { Canvas, useThree  } from '@react-three/fiber';
import { OrbitControls, CameraControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import {Group, Object3DEventMap} from 'three';
import { stat } from 'fs';


interface SceneProps {
  children: ReactNode;  // Accepts any React component as children
}

//style={{ width: '100%', height: '90vh' }}

const Scene: React.FC<SceneProps> = ({ children }) => {


/*
    <Canvas camera={{ position: [0, 1, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enableZoom={true} />
        <ContactShadows position-y-={-1.5} opacity={0.3} blur={3} />
        <Suspense>
          
          {children}
        </Suspense>

    </Canvas>


        

*/

  return (
      <Canvas >
        <PerspectiveCamera makeDefault fov={75} position={[0, 1, 5]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <OrbitControls enableZoom={true} />
        <Suspense>
          {children}
        </Suspense>
    </Canvas>
  );
};


export default Scene;
