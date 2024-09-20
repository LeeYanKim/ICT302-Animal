import React, {useContext} from 'react';
import { Box, Typography, Container, Button, Card, CardContent, Grid2 as Grid} from '@mui/material';
import { Link } from 'react-router-dom';

// Import of the LandingPage CSS file
import './LandingPage.css';

import Item from '../Components/UI/Item';
import { UserProfileContext } from "../Internals/ContextStore";

// This is the Landing Page for the application



const LandingPage: React.FC = () => {
    const userContext = useContext(UserProfileContext);
    return (
        <Container sx={{ my: 5 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {/* Left side with 2x2 grid of GIFs */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)', // Creates 2 columns
                        gap: 2, // Gap between GIFs
                        width: '65%', // Takes 65% of the space
                    }}
                >
                    <Box>
                        <img
                            src="./assets/images/landing/wire_no_background.png"
                            alt="GIF 1"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Box>
                    <Box>
                        <img
                            src="./assets/images/landing/model_no_background.png"
                            alt="GIF 2"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Box>
                    <Box>
                        <img
                            src="./assets/images/landing/model_no_background.png"
                            alt="GIF 3"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Box>
                    <Box>
                        <img
                            src="./assets/images/landing/wire_no_background.png"
                            alt="GIF 4"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </Box>
                </Box>

                {/* Right side with the quote */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        textAlign: 'center',
                        padding: '20px', // Add padding for breathing space
                        backgroundColor: '#f2f0e8', // Optional: add background color for contrast
                        borderRadius: '8px', // Rounded corners for a softer look
                    }}
                >
                    {/* Upper Divider */}
                    <Box
                        sx={{
                            width: '80%', // Make it slightly smaller for better visual hierarchy
                            borderBottom: 4,
                            borderColor: '#ae0001',
                            mb: 3, // More space below the divider
                        }}
                    />

                    {/* Title */}
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontFamily: 'Poppins, sans-serif', // Custom font
                            fontWeight: 'bold', // Make it bold for emphasis
                            textAlign: 'center', // Center the text
                            mb: 1, // Reduce bottom margin for better spacing
                        }}
                    >
                        Building 3D Models
                    </Typography>

                    <Typography
                        variant="h4"
                        component="p"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 'normal', // Keep normal weight for contrast
                            textAlign: 'center',
                            mb: 1, // Adjust spacing
                        }}
                    >
                        using
                    </Typography>

                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 3, // Add some margin to balance with the lower divider
                        }}
                    >
                        Artificial Intelligence
                    </Typography>
                    {/* Lower Divider */}
                    <Box
                        sx={{
                            width: '80%',
                            borderTop: 4,
                            borderColor: '#ae0001',
                            mt: 3, // Adjust margin for consistent spacing
                        }}
                    />
                </Box>


            </Box>
        </Container>
    );
};

export default LandingPage;
