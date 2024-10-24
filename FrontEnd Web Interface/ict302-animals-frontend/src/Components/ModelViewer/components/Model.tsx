import React, { useRef, useEffect, createRef, useState } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Wireframe, useAnimations } from '@react-three/drei';
import {
    AnimationMixer,
    Group,
    Box3,
    SkinnedMesh,
    Vector3,
    MeshStandardMaterial,
    Mesh,
    BufferGeometry,
    Object3DEventMap,
    Material
} from 'three';


interface ModelProps {
    url: string;
    isAnimating: boolean;
    wireframe: boolean;
    animationSpeed: number;
    isLooping: boolean;
    isRotating: boolean;
    isSkeleton: boolean;
    animationPosition: number;
    setAnimationPosition: any;
    animationMaxPos: number;
    setAnimationMaxPos: any;
}

const Model: React.FC<ModelProps> = ({ url, isAnimating, wireframe, animationSpeed, isSkeleton, isRotating, isLooping, animationPosition, animationMaxPos, setAnimationMaxPos, setAnimationPosition}) => {
    const modelRef = useRef<Group | null>(null);
    const mixerRef = useRef<AnimationMixer | null>(null);
    const { camera } = useThree();
    const gltf = useGLTF(url);
    //@ts-ignore
    gltf.scene.children[0].geometry.center()
    //@ts-ignore
    //gltf.scene.children[0].geometry.scale(2,2,2)
    //gltf.scene.scale.set(10,10,10);
    //gltf.scene.scale.set(100,100,100);
    //const bx = new Box3().setFromObject(gltf.scene);
    //const center = bx.getCenter(new Vector3());
    //gltf.scene.position.sub(center)
    gltf.scene.rotation.set(90,0,0);


    let animPos = 0;

    function ManageAnimations() {
        if (gltf.animations.length > 0 && modelRef.current) {
            mixerRef.current = new AnimationMixer(modelRef.current);
            // Play the first animation clip by default
            // @ts-ignore
            const action = mixerRef.current.clipAction(gltf.animations[0]);
            setAnimationMaxPos(gltf.animations[0].duration * 1000);
            setAnimationPosition(0);
            action.play();

            // Optionally, store the action in a ref
            //mixerRef.current.clipAction(gltf.animations[0]).play();
        }
    }

    function PositionCamera() {

        // Position the model in view
        if (modelRef.current) {
            const box = new Box3().setFromObject(gltf.scene);
            const size = new Vector3();
            box.getSize(size);

            modelRef.current.position.set(0, -size.y / 2, 0);
            modelRef.current.scale.set(1, 1, 1);
            const distance = Math.max(size.x, size.y, size.z);
            camera.position.set(distance, distance/2, distance);
            //camera.lookAt(modelRef.current.position);

        }
    }

    function MakeWireframe() {
        if(modelRef.current) {
            let model = gltf.scene
            model.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    //@ts-ignore
                    child.material.wireframe = wireframe;
                }
            });
        }
    }

    function UpdateRotation() {
        if(isRotating && modelRef.current) {
            modelRef.current.rotation.y += 0.01;
        }
    }

    function UpdateAnimPosition() {
        if(animPos > animationMaxPos) {
            animPos = 0;
        }
        setAnimationPosition(animPos);
    }



    useEffect(() => {
        PositionCamera();
    }, [modelRef.current?.position]);

    useEffect(() => {

        ManageAnimations();


        MakeWireframe();

        isRotating && UpdateRotation();


        return () => {
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current = null;
            }
        };
    }, [gltf,isAnimating, wireframe, animationSpeed, isLooping, isRotating]);

    useFrame((state, delta) => {
        if (mixerRef.current) {
            if (isAnimating) {
                mixerRef.current.update(delta);
                mixerRef.current.timeScale = animationSpeed;
                animPos += (delta * 1000);
                UpdateAnimPosition();
            } else {
                mixerRef.current.timeScale = 0; // Pause the animation
            }
        }
    });


    return (
        <>
        <primitive ref={modelRef} object={gltf.scene}/>
        </>
    );
};

export default Model;
