import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { Play, Pause, PlusCircle, MinusCircle, Repeat, RotateCw, Settings } from 'react-feather';

interface ControlsProps {
    isAnimating: boolean;
    setIsAnimating?: any;
    toggleWireframe: boolean;
    setToggleWireframe?: any;
}

const Controls: React.FC<ControlsProps> = ({isAnimating, setIsAnimating, toggleWireframe, setToggleWireframe}) => {

    return (
        <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
            }}>
            <Stack spacing={2} direction="column" sx={{ alignItems: 'center', mb: 1 }}>
                <Slider defaultValue={50} aria-label="Animition Position" />
                <ButtonGroup variant="contained" aria-label="3D Model View Controls">
                    <Button onClick={() => {setIsAnimating(!isAnimating)}}>{ isAnimating ? <Pause/> : <Play/>} </Button>
                    <Button><PlusCircle/></Button>
                    <Button><MinusCircle/></Button>
                    <Button><Repeat/></Button>
                    <Button><RotateCw/></Button>
                    { toggleWireframe ? 
                        <Button variant="contained" color='secondary' onClick={() =>{setToggleWireframe(false)}}><Settings/></Button> : 
                        <Button color='secondary' onClick={() =>{setToggleWireframe(true)}}><Settings/></Button>}
                </ButtonGroup>
            </Stack>
        </Box>
    );
}

export default Controls;