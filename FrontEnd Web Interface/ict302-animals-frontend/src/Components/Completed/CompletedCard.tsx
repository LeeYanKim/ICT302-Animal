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

import ModelViewer from '../../Components/ModelViewer/ModelViewer';

export type CompletedCardProps = {
  title: string;
  status: string;
  modelPath: string;
};

const CompletedCard: React.FC<CompletedCardProps> = ({ title, status, modelPath}) =>{
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: '100%',minWidth: 450, flexGrow: 1}}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Item: {title}
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
              <Typography variant="h6" component="p">
                Status: {status === "Complete" ? <Chip label="Complete" color="success" /> : <Chip label="In Progress" color="warning" />}
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'center' }}>
                
                <ModelViewer modelPath={modelPath}/>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CompletedCard;