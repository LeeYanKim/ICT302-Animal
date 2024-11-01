import React from "react";
import {Box, Card, CardContent, CardMedia, Grid2 as Grid, Typography} from "@mui/material";
import ReactPlayer from "react-player";
import {AccessTime, Folder} from "@mui/icons-material";
import moment from 'moment';

interface AnimalMediaViewerProps {
    graphicId: string;
    graphicFilePath: string;
    isImage: boolean;
    uploadedDate: string;
    fileSize: string;
}

const AnimalMediaViewer: React.FC<AnimalMediaViewerProps> = ({graphicId, graphicFilePath, isImage, uploadedDate, fileSize}) => {

    const formatUploadedDate = () => {
        let date = moment(uploadedDate, 'YYYY-MM-DDTHH:mm:ss');
        return date.format('DD/MM/YYYY');
    }

  return (
    <div key={graphicId}>
        {isImage ? (
            <Box
                component="img"
                src={graphicFilePath}
                alt={`Media ${graphicId}`}
                sx={{ width: '100%', height: 'auto' }}
            />
        ) : (
            <Card>
                <CardMedia>
                    <ReactPlayer key={graphicId} width="100%" height="100%" url={graphicFilePath} controls/>
                </CardMedia>
                <CardContent>
                    <Grid container spacing={4} >
                        <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center'}}>
                                <AccessTime sx={{paddingTop: '6px'}}/>Uploaded: {formatUploadedDate()}
                            </Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center'}}>
                                <Folder sx={{paddingTop: '6px'}}/>Size: {fileSize}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )}
    </div>
  );
};

export default AnimalMediaViewer;