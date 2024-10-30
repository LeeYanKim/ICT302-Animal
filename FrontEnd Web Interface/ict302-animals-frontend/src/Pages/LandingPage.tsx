import React, { useContext } from 'react';
import { Box, Typography, Container, Button, Card, CardContent, Grid2 as Grid } from '@mui/material';
import { Link } from 'react-router-dom';

// Import of the LandingPage CSS file
import './LandingPage.css';

import Item from '../Components/UI/Item';
import { FrontendContext } from "../Internals/ContextStore";

// This is the Landing Page for the application



const LandingPage: React.FC = () => {
    const frontendContext = useContext(FrontendContext);
    return (
        <>
            {/* Right side with the quote */}
            <Container style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 0 }}>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '30%',
                        textAlign: 'center',
                        padding: '20px', // Add padding for breathing space
                        //backgroundColor: '#linear-gradient(270deg, rgba(255,105,105,0.3), rgba(173,216,230,0.6))', // Optional: add background color for contrast
                        //borderRadius: '8px', // Rounded corners for a softer look
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

            </Container>
            

            {/*About us underneath, on another level*/}
            <Container
                sx={{ my: 3 }}>
                <Box
                    sx={{
                        background: 'linear-gradient(270deg, rgba(255,105,105,0.3), rgba(173,216,230,0.6))',
                        borderRadius: '5px'
                    }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: 'Kanit, sans-serif',
                            fontWeight: '200',
                        }}>Explore the possibilities of animal modelling using AI
                    </Typography>
                </Box>
                    <Typography sx={{fontFamily : 'Kanit , sans-serif', fontWeight : '250', fontSize : '1rem'}}>
                        Imagine a world where the transformation of simple animal videos into detailed, lifelike 3D models is as effortless as the click of a button. Our cutting-edge application leverages the power of AI to revolutionize how we capture and visualize animals, making advanced 3D modeling accessible to everyone, from veterinary professionals to passionate animal enthusiasts.
                    </Typography>
                    <br/>
                    <Typography sx={{fontFamily : 'Kanit , sans-serif', fontWeight : '250', fontSize : '1rem'}}>
                        In animal hospitals, our technology offers a breakthrough: the ability to generate precise 3D scans without the need for invasive procedures, sedatives, or expensive machinery. Vets can now quickly and accurately assess an animal’s physical condition, monitor their posture, and detect abnormalities like limps, all while ensuring the animal remains stress-free and comfortable. With our application, even the most modest veterinary practice can access tools that once required state-of-the-art equipment.
                    </Typography>
                    <br/>
                    <Typography sx={{fontFamily : 'Kanit , sans-serif', fontWeight : '250', fontSize : '1rem'}}>
                        But the possibilities extend beyond medical applications. Farmers and animal carers can use our platform to track the development of livestock over time, gaining insights into their health and physical progress with unparalleled precision. Imagine being able to observe a horse’s gait or a cow’s mobility issues through a series of consistent 3D models—enabling early intervention and improving the well-being of animals under their care.
                    </Typography>
                    <br/>
                    <Typography sx={{fontFamily : 'Kanit , sans-serif', fontWeight : '250', fontSize : '1rem'}}>
                        Our technology also finds a place in the world of entertainment. Whether you’re an animator, game developer, or digital artist, our solution provides a fast and affordable way to bring animals to life in 3D. No more waiting for costly and time-consuming modeling processes—just upload your video, and our AI does the rest, delivering a fully interactive model in no time.
                    </Typography>
                    <br/>
                    <Typography sx={{fontFamily : 'Kanit , sans-serif', fontWeight : '250', fontSize : '1rem'}}>
                        We’re just getting started. Our mission is to expand the horizons of animal modeling by incorporating even more advanced AI capabilities. As we evolve, we aim to scan a broader range of animals—and perhaps even humans—bringing our transformative technology to new domains and applications. Join us on this exciting journey as we redefine the future of 3D modeling, making it faster, more affordable, and accessible to all.
                    </Typography>

            </Container>
            <Container
                sx={{
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: 0,
                    my: 5
                }}
            >
                <Box
                    sx={{
                        background: 'linear-gradient(90deg, rgba(255,105,105,0.3), rgba(173,216,230,0.6))',
                        height: '30px',
                        width: '80vw', // Set the width to 80% of the viewport width
                    }}
                />
            </Container>

            <Container sx={{ my: 5 }} style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 0 }}>
            
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




                </Box>
            </Container>
        </>
    );
};

export default LandingPage;
