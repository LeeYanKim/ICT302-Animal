import React, { ReactNode, useEffect, useRef, createRef, Suspense } from 'react';
import { Canvas, useThree  } from '@react-three/fiber';
import {
    OrbitControls,
    CameraControls,
    ContactShadows,
    PerspectiveCamera,
    Html,
    useProgress,
    GizmoHelper,
    GizmoViewport
} from '@react-three/drei';
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
      <Canvas shadows camera={{position: [-10, 10, 10], fov: 20}}>
          <ambientLight intensity={1}/>
          <directionalLight castShadow position={[-2.5, 5, -5]} intensity={0.5} shadow-mapSize={[1024, 1024]}/>
          <directionalLight castShadow position={[2.5, 5, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]}>
              <orthographicCamera attach={'shadow-camera'} args={[-5, 5, 5, -5, 1, 50]}/>
          </directionalLight>
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
              <GizmoViewport labelColor="white" axisHeadScale={1}/>
          </GizmoHelper>
          <gridHelper args={[20, 20]}/>
          <OrbitControls enableZoom={true}/>
          <Suspense fallback={<Loader/>}>
              {children}
          </Suspense>
      </Canvas>
);
};


export default Scene;
