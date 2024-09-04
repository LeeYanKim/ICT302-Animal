import React, { useRef, useEffect, createRef } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Wireframe, useAnimations } from '@react-three/drei';
import {AnimationMixer, Group, Box3, SkinnedMesh, Vector3, MeshStandardMaterial, Mesh, BufferGeometry, Object3DEventMap} from 'three';


interface ModelProps {
    url: string;
    isAnimating: boolean;
    wireframe: boolean;
}

const Model: React.FC<ModelProps> = ({ url, isAnimating, wireframe }) => {
    const group = createRef<Group<Object3DEventMap>>();
    const modelRef = useRef<Group | null>(null);
    const mixerRef = useRef<AnimationMixer | null>(null);
    const { camera } = useThree();
    const gltf = useGLTF(url);

    const { nodes, materials, animations } = useGLTF(url);
    const { actions } = useAnimations(animations, group);
    
    console.log(actions);



    
    /*useEffect(() => {
        actions[0]?.reset().play();
      }, [actions]);*/

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

    

/*
<>
            <group ref={group}>
                <primitive ref={modelRef} object={gltf.scene}>
                    </primitive>
            </group>
        </>
        */

    return (
        <>
        <primitive ref={modelRef} object={gltf.scene}/>
        {wireframe && <></>/*<Wireframe />*/ }
        </>
    );
};

export default Model;
