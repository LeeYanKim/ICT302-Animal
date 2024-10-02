import React, {useEffect, useState} from 'react';

import { Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material';
import { SparkLineChart, areaElementClasses } from '@mui/x-charts';

import API from '../../Internals/API';

export type AnimalCardProps = {
    animalName: string;
    animalDOB: Date;
    animalType: string;
};

const AnimalCard: React.FC<AnimalCardProps> = ({ animalName, animalDOB, animalType}) =>{
    const theme = useTheme();

    const [animalImage, setAnimalImage] = useState<string>('');

    const handleGetAnimalImage = async () => {
        let filePath = API.Download() + '/' + animalType.toLowerCase() + '.png';
        let response;
        
        try {
            response = await fetch(filePath);
        } catch (error) {
            console.error(error);
        }


        if(response?.ok)
        {
            const data = await response.blob();
            let d = URL.createObjectURL(data);
            setAnimalImage(d);
        }
        else
        {
            console.log('Falling back to internal animal images');
            const img = '/assets/images/fallback/' + animalType.toLowerCase() + '.png';
            setAnimalImage(img);
        }

    }

    useEffect(() => {
        handleGetAnimalImage();
    }, []);


    return (
        <Card variant="outlined" sx={{ height: '100%',minWidth: 450, flexGrow: 1}}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Name: {animalName}
                </Typography>
                <Stack
                    direction="column"
                    sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}
                >
                    <Stack sx={{ justifyContent: 'space-between' }}>
                        <Stack
                            direction="row"
                            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                        >
                        </Stack>
                        { animalImage && <img src={animalImage} alt={animalName} style={{width: '100px', height: '100px'}}/> }
                        <Stack direction="row" sx={{ justifyContent: 'center' }}>
                            <Chip label={animalType} />
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default AnimalCard;