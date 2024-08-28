import React from 'react';
import { Typography, Container, Button, Card, CardContent } from '@mui/material';
import Grid  from '@mui/material/Grid2';
import { Box } from '@mui/system';

// Import of the LandingPage CSS file
import './LandingPage.css';

import Item from '../Components/UI/Item';

// This is the Landing Page for the application



const LandingPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>

            <Box
                sx={{
                    height: '50vh',
                    backgroundImage: 'url(./assets/images/landing/landing_header_2.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Container>
                    <Typography variant="h2" component="h1" gutterBottom>
                        Get Started
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom>
                        Automatic 3D Model Generation from Images and Videos
                    </Typography>
                    <Button variant="contained" color="primary" size="large">
                        Get Started
                    </Button>
                </Container>
            </Box>

            <Container sx={{ my: 5 }}>
                <Grid container spacing={4}>
                    <Grid size={4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <img
                                    src="./assets/images/landing/landing_generation.gif"
                                    alt="Upload Media"
                                    style={{ width: '250px', height: 'auto' }}
                                />
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Upload Media
                                </Typography>
                                <Typography component="p">
                                    Upload images and videos to generate 3D models.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <img
                                    src="./assets/images/landing/landing_generation.gif"
                                    alt="Generate 3D Models"
                                    style={{ width: '250px', height: 'auto' }}
                                />
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Generate 3D Models
                                </Typography>
                                <Typography component="p">
                                    Create detailed 3D models from your media files.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <img
                                    src="./assets/images/landing/landing_generation.gif"
                                    alt="Visualize Results"
                                    style={{ width: '250px', height: 'auto' }}
                                />
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Visualize Results
                                </Typography>
                                <Typography component="p">
                                    View and interact with the generated 3D models.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;
