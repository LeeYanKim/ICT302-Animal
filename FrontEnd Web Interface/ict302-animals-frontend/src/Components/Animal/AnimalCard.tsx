import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';


export type AnimalCardProps = {
    animalName: string;
    animalDOB: Date;
    animalType: string;
};

const AnimalCard: React.FC<AnimalCardProps> = ({ animalName, animalDOB, animalType}) =>{
    const theme = useTheme();

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