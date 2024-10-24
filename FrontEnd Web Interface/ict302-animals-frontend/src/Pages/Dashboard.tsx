import React, { useContext , useEffect} from 'react';
import { PaletteMode, createTheme, ThemeProvider, alpha, SwipeableDrawer, Box, Stack, Theme , useMediaQuery } from '@mui/material';

import AppNavbar from '../Components/Dashboard/AppNavbar';
import Header from '../Components/Dashboard/Header';
import SideMenu from '../Components/Dashboard/SideMenu';

import { FrontendContext } from "../Internals/ContextStore";
import DashboardPages, {getDashboardPageFromName, getNameFromDashboardPage, getDashboardPageFromPath, getDashboardPageRenderFromDashboardPage}  from '../Components/Dashboard/DashboardHelpers';
import UserAlert from '../Internals/components/Alerts/Alert';
import CompletedItem from '../Internals/data/CompletedItem';


interface DashboardProps {
  renderedPage?: string;
}



const Dashboard: React.FC<DashboardProps> = ({ renderedPage }) => {



  const frontendContext = useContext(FrontendContext);
  let alerts: React.ReactNode[] = [];

  const [currentDashboardPage, setCurrentDashboardPage] = React.useState<DashboardPages>(renderedPage ? getDashboardPageFromPath(renderedPage) : DashboardPages.Upload);
  const [alertQueue, setAlertQueue] = React.useState<React.ReactNode[]>(alerts);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false); // State to handle drawer open/close
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('md')); // Check if screen size is medium or larger

  //console.log("Dashboard Page: ", getNameFromDashboardPage(currentDashboardPage));

  //This removes alerts after 5 seconds
  useEffect(() => {
    let timer = setTimeout(() => {setAlertQueue([])}, 5000);
    return () => {
      clearTimeout(timer);
    };
  },[alertQueue]);

  const toggleDrawer = (newState: boolean) => () => {
    setIsDrawerOpen(newState);
  };


  //This removes items from the queue after 15 seconds for testing purposes
  useEffect(() => {
    let timer = setTimeout(() => {
      if(frontendContext.user.contextRef.current.currentItemsInQueue > 0) {
        frontendContext.user.contextRef.current.currentItemsInQueue -= 1;
        frontendContext.user.contextRef.current.completedItems.push({id: "1", name: "Test Item", size: 1, type: "3d Model", status: "Complete", modelPath: "/3d_test_files/toon_cat_free.glb"});
        frontendContext.user.contextRef.current.currentCompletedItems += 1;
        frontendContext.user.contextRef.current.currentItemsInProcessQueue.shift();
      }
    }, 15000);
    return () => {
      clearTimeout(timer);
    };
  },[frontendContext.user.contextRef.current.currentItemsInQueue]);

  return (
        <Box sx={{ display: 'flex', position: 'relative' }}>
          {isLargeScreen ? (
          <SideMenu currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage} />
        ) : (
          <SwipeableDrawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <SideMenu
            currentDashboardPage={currentDashboardPage}
            setCurrentDashboardPage={setCurrentDashboardPage}
            variant="temporary"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
          />
        </SwipeableDrawer>
      )}
          <AppNavbar currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage} />
          {/* Main content */}
          <Box
              component="main"
              
              sx={(theme: { palette: { background: { default: string; }; }; }) => ({
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
                  ))} {/* Render any alerts TODO: Fix colouring bug that doesnt upate alert colour */}
                  {getDashboardPageRenderFromDashboardPage(currentDashboardPage, alertQueue, setAlertQueue)} {/* Render the given page from the router or the main grid if on dashboard home */}
              </>
            </Stack>
          </Box>
        </Box>
  );
}

export default Dashboard;