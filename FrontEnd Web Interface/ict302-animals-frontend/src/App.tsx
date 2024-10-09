import React, {useEffect, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Import of the Main App CSS file
import './App.css';

// Imports of our components
import LandingNav from './Components/LandingNav';

// Imports of our pages
import LandingPage from './Pages/LandingPage';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Enterprise from './Pages/Enterprise';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import SignOut from './Pages/SignOut';
import Dashboard from './Pages/Dashboard';
import AnimalDetails from './Components/Animal/AnimalDetails';  // Import the AnimalDetails component for animal page

import UserProfile from './Internals/UserProfile';
import {FrontendContext} from './Internals/ContextStore';


// Imports of MUI and custom Theme components
import AppTheme from "./Components/UI/Theme";
import {createTheme, PaletteMode, ThemeProvider, Button, CssBaseline} from "@mui/material";

import getDashboardTheme from './Theme/getDashboardTheme';

import DashboardPage from './Components/Dashboard/DashboardHelpers';
import DashboardPageDisplay from './Components/Dashboard/DashboardPageDisplay';

const App: React.FC = () => {

    // These are the media queries that will be used to determine the screen size
    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

    const [mode, setMode] = React.useState<PaletteMode>('light');
    const dashboardTheme = createTheme(getDashboardTheme(mode));


    let currentLocation = useLocation();
    let currentPath = currentLocation.pathname;
    let currentSearch = currentLocation.search;
    let currentHash = currentLocation.hash;
    useEffect(() => {
        currentPath = currentLocation.pathname;
        currentSearch = currentLocation.search;
        currentHash = currentLocation.hash;
    }, [currentLocation]);

    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const defaultTheme = createTheme({ palette: { mode } });
    // This code only runs on the client side, to determine the system color preference
    React.useEffect(() => {
      // Check if there is a preferred mode in localStorage
      const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
      if (savedMode) {
        setMode(savedMode);
      } else {
        // If no preference is found, it uses system preference
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
        setMode(systemPrefersDark ? 'dark' : 'light');
      }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
    };

    const frontendContext = useContext(FrontendContext);


    const dashboardPaghPaths = [
        "/dashboard",
        "/dashboard/home",
        "/dashboard/upload",
        "/dashboard/queue",
        "/dashboard/completed",
        "/dashboard/settings",
        "/dashboard/about",
        "/dashboard/feedback",
        "/dashboard/help",
        "/dashboard/account",
        "/dashboard/animals"
    ];

// Returns the main component of the app with the navigation bar and the routes
    return (
        <ThemeProvider theme={dashboardTheme}>
        <CssBaseline enableColorScheme />
            <main>
                <div className="d-flex flex-row">
                    {!currentPath.includes("dashboard") && isTabletOrMobile && <LandingNav />} {/* TODO Add a mobile/tabled variation of the nav bar*/}
                    {!currentPath.includes("dashboard") && isDesktopOrLaptop && <LandingNav />}
                    <Button onClick={toggleColorMode}>Toggle Color Mode</Button>
                    <div className="d-flex flex-column content" id="page-wrap">
                        <Routes> {/* This is where the routes are defined */}

                            <Route path="/" element={<LandingPage />} /> {/* This is the default route */}
                            <Route path="/about" element={<About />} /> {/* This is the about page */}
                            <Route path="/contact" element={<Contact />} /> {/* This is the contact page */}
                            <Route path="/enterprise" element={<Enterprise/>} /> {/* This is the enterprise page */}
                            <Route path="/signin" element={<SignIn />} /> {/* This is the sign in page */}
                            <Route path="/signup" element={<SignUp />} /> {/* This is the sign in page */}
                            <Route path="/signout" element={<SignOut />} /> {/* This is the sign in page */}
                            {dashboardPaghPaths.map((dashboardPath, index) => (
                                <Route key={index} path={dashboardPath} element={frontendContext.user.valid ? <Dashboard renderedPage={dashboardPath}/> : <Navigate to="/" />} />
                            ))};

                            <Route path="/dashboard/animals/:animalId" element={<AnimalDetails />} /> {/* Animal details page */}

                            <Route path="*" element={<Navigate to="/" />} /> {/* This will redirect to the landing page if the route is not found */}

                        </Routes>
                    </div>
                </div>
            </main>
        </ThemeProvider>
    );
}

export default App;