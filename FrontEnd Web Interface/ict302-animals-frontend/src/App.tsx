import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

// Import of the Main App CSS file
import './App.css';

// Imports of our components
import NavigationBar from './Components/Navigation';

// Imports of our pages
import LandingPage from './Pages/LandingPage';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';

// Imports of testing pages
import View from './Pages/View';

// Imports of MUI and custom Theme components
import AppTheme from "./Components/UI/Theme";
import {ThemeProvider} from "@mui/material/styles";

function App() {

    // These are the media queries that will be used to determine the screen size
    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

// Returns the main component of the app with the navigation bar and the routes
  return (
      <ThemeProvider theme={AppTheme}>
          <Router>
              <main>
                  <div className="d-flex flex-row">
                      {isTabletOrMobile && <NavigationBar />} {/* TODO Add a mobile/tabled variation of the nav bar*/}
                      {isDesktopOrLaptop && <NavigationBar />}
                      <div className="d-flex flex-column content" id="page-wrap">
                          <Routes> {/* This is where the routes are defined */}

                                <Route path="/" element={<LandingPage />} /> {/* This is the default route */}
                                <Route path="/about" element={<About />} /> {/* This is the about page */}
                                <Route path="/contact" element={<Contact />} /> {/* This is the contact page */}
                                <Route path="/login" element={<Login />} /> {/* This is the login page */}
                                <Route path="*" element={<Navigate to="/" />} /> {/* This will redirect to the landing page if the route is not found */}
                                <Route path="/home" element={<Navigate to="/" />} /> {/* This will redirect to the landing page*/}

                              {/* TODO Remove testing routes*/}

                                <Route path={"/test/viewer"} element={<View />} />

                          </Routes>
                      </div>
                  </div>
              </main>
          </Router>
      </ThemeProvider>
  );
}

export default App;
