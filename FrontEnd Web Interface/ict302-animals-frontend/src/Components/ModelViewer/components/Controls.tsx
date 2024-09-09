import React, {useEffect, useState} from "react";

import { Tooltip, Box, Button, ButtonGroup, Slider, Stack } from '@mui/material';


import { Play, Pause, PlusCircle, MinusCircle, Repeat, RotateCw, Settings } from 'react-feather';

interface ControlsProps {
    isAnimating: boolean;
    setIsAnimating?: any;
    toggleWireframe: boolean;
    setToggleWireframe?: any;
    isRotating: boolean;
    setIsRotating: any;
    isLooping: boolean;
    setIsLooping: any;
    animationSpeed: number;
    setAnimationSpeed: any;
    isSkeleton: boolean;
    setIsSkeleton: any;
    animationPosition: number;
    animationMaxPos: number;

}

const Controls: React.FC<ControlsProps> = ({isAnimating, setIsAnimating, toggleWireframe, setToggleWireframe, animationSpeed, setAnimationSpeed, isLooping, setIsLooping, isSkeleton, setIsSkeleton, setIsRotating, isRotating, animationPosition, animationMaxPos}) => {

    function increaseAnimSpeed() {
        // Clamp the animation speed to a maximum of 2
        if(animationSpeed + 0.1 > 2) {
            setAnimationSpeed(2);
        }
        else{
            setAnimationSpeed(animationSpeed + 0.1);
        }

    }

    function decreaseAnimSpeed() {
        if(animationSpeed - 0.1 < 0.1) {
            setAnimationSpeed(0.1);
        }
        else {
            setAnimationSpeed(animationSpeed - 0.1);
        }
    }

    function toggleRotation() {
        setIsRotating(!isRotating);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleSkelleton() {
        setIsSkeleton(!isSkeleton);
    }

    function toggleWireframeVisible() {
        setToggleWireframe(!toggleWireframe);
    }

    function toggleAnimation() {
        setIsAnimating(!isAnimating);
    }

    function updateAnimationPosition(event: any, value: number | number[]) {
        //setAnimationPosition({currentPos: value as number, maxPos: animationPosition.maxPos});
    }

    useEffect(() => {
        //setLocalAnimationPosition(animationPosition.current.currentPos);
        //console.log(animationPosition);
    },[animationPosition]);

    return (
        <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
            }}>
            <Stack spacing={2} direction="column" sx={{ alignItems: 'center', mb: 1 }}>
                <Slider defaultValue={0} value={animationPosition} min={0} max={animationMaxPos} disabled aria-label="Animition Position" />
                <ButtonGroup variant="contained" aria-label="3D Model View Controls">
                    {isAnimating && <Button onClick={toggleAnimation}><Tooltip title={'Pause'} arrow><Pause/></Tooltip></Button>}
                    {!isAnimating && <Button onClick={toggleAnimation}><Tooltip title={'Play'} arrow><Play/></Tooltip></Button>}
                    <Button onClick={increaseAnimSpeed}><Tooltip title={'Speed Up Animation'} arrow><PlusCircle/></Tooltip></Button>
                    <Button onClick={decreaseAnimSpeed}><Tooltip title={'Slow Down Animation'} arrow><MinusCircle/></Tooltip></Button>
                    <Button onClick={toggleLoop}><Tooltip title={'Toggle Animation Loop'} arrow><Repeat/></Tooltip></Button>
                    <Button onClick={toggleRotation}><Tooltip title={'Toggle Rotation'} arrow><RotateCw/></Tooltip></Button>
                    { toggleWireframe ? 
                        <Button variant="contained" color='secondary' onClick={toggleWireframeVisible}><Tooltip title={'Toggle Wireframe'} arrow><Settings/></Tooltip></Button> :
                        <Button variant="outlined" color='secondary' onClick={toggleWireframeVisible}><Tooltip title={'Toggle Wireframe'} arrow><Settings/></Tooltip></Button>}
                </ButtonGroup>
            </Stack>
        </Box>
    );
}

export default Controls;