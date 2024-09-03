import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { Play, Pause, PlusCircle, MinusCircle, Repeat, RotateCw, Settings } from 'react-feather';

interface ControlsProps {
    isAnimating: boolean;
    toggleWireframe: boolean;
}

const Controls: React.FC<ControlsProps> = ({isAnimating, toggleWireframe}) => {

    return (
        <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
            }}>
            <Stack spacing={2} direction="column" sx={{ alignItems: 'center', mb: 1 }}>
                <Slider defaultValue={50} aria-label="Animition Position" />
                <ButtonGroup variant="contained" aria-label="3D Model View Controls">
                    <Button>{ isAnimating ? <Pause/> : <Play/>} </Button>
                    <Button><PlusCircle/></Button>
                    <Button><MinusCircle/></Button>
                    <Button><Repeat/></Button>
                    <Button><RotateCw/></Button>
                    { toggleWireframe ? 
                        <Button variant="contained" color='secondary'><Settings/></Button> : 
                        <Button color='secondary'><Settings/></Button>}
                </ButtonGroup>
            </Stack>
        </Box>
    );
}

export default Controls;