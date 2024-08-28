import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {AnimationMixer, Group, Box3, Vector3, MeshStandardMaterial, Mesh, BufferGeometry} from 'three';

interface ModelProps {
    url: string;
    isAnimating: boolean;
}

const Model: React.FC<ModelProps> = ({ url, isAnimating }) => {
    const modelRef = useRef<Group | null>(null);
    const mixerRef = useRef<AnimationMixer | null>(null);
    const { camera } = useThree();
    const gltf = useLoader(GLTFLoader, url);

    console.log(gltf)
    
    
    useEffect(() => {
        if (gltf.animations.length > 0 && modelRef.current) {
            mixerRef.current = new AnimationMixer(modelRef.current);

        // Play the first animation clip by default
            const action = mixerRef.current.clipAction(gltf.animations[0]);
            action.play();
            
        // Optionally, store the action in a ref
            mixerRef.current.clipAction(gltf.animations[0]).play();
        }

     // Position the model in view
        if (modelRef.current) {
            const box = new Box3().setFromObject(modelRef.current);
            const size = new Vector3();
            box.getSize(size);

            modelRef.current.position.set(0, -size.y / 2, 0);
            modelRef.current.scale.set(1, 1, 1);

            const distance = Math.max(size.x, size.y, size.z);
            camera.position.set(0, distance / 2, distance * 1.5);
            camera.lookAt(modelRef.current.position);
        }

        return () => {
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current = null;
            }
        };
    }, [gltf, camera, isAnimating]);

    useFrame((state, delta) => {
        if (mixerRef.current) {
            if (isAnimating) {
                mixerRef.current.update(delta);
            } else {
                mixerRef.current.timeScale = 0; // Pause the animation
            }
        }
    });

    return <primitive ref={modelRef} object={gltf.scene}/>;
};

export default Model;
