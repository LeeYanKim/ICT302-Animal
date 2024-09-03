import React, { useContext , useEffect} from 'react';
import { PaletteMode, createTheme, ThemeProvider, alpha, CssBaseline, Box, Stack } from '@mui/material';

import AppNavbar from '../Components/Dashboard/AppNavbar';
import Header from '../Components/Dashboard/Header';
import SideMenu from '../Components/Dashboard/SideMenu';

import { UserProfileContext } from "../Internals/ContextStore";
import DashboardPages, {getDashboardPageFromName, getNameFromDashboardPage, getDashboardPageFromPath, getDashboardPageRenderFromDashboardPage}  from '../Components/Dashboard/DashboardHelpers';
import UserAlert from '../Internals/components/Alerts/Alert';


interface DashboardProps {
  renderedPage?: string;
}



const Dashboard: React.FC<DashboardProps> = ({ renderedPage }) => {



  const userContext = useContext(UserProfileContext);
  let alerts: React.ReactNode[] = [];

  const [currentDashboardPage, setCurrentDashboardPage] = React.useState<DashboardPages>(renderedPage ? getDashboardPageFromPath(renderedPage) : DashboardPages.Home);
  const [alertQueue, setAlertQueue] = React.useState<React.ReactNode[]>(alerts);

  console.log("Dashboard Page: ", getNameFromDashboardPage(currentDashboardPage));

  useEffect(() => {
    let timer = setTimeout(() => {setAlertQueue([])}, 15000);
    return () => {
      clearTimeout(timer);
    };
  },[alertQueue]);

  console.log("Alert Queue: ", alertQueue);

  return (
        <Box sx={{ display: 'flex' }}>
          <SideMenu currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage} />
          <AppNavbar currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage} />
          {/* Main content */}
          <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: alpha(theme.palette.background.default, 1),
                overflow: 'auto',
              })}
          >
            <Stack
                spacing={2}
                sx={{
                  alignItems: 'center',
                  mx: 3,
                  pb: 10,
                  mt: { xs: 8, md: 0 },
                }}
            >
              <>
              
              <Header currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage}/>
                {alertQueue.length > 0 && alertQueue.map((alert, index) => (
                  <div key={index}>{alert}</div> //
                ))} {/* Render any alerts */}
                {getDashboardPageRenderFromDashboardPage(currentDashboardPage, alertQueue, setAlertQueue)} {/* Render the given page from the router or the main grid if on dashboard home */}
              </>
            </Stack>
          </Box>
        </Box>
  );
}

export default Dashboard;