import React, { useContext} from 'react';
import { styled, Avatar, Box, Divider, Stack, Typography, Drawer as MuiDrawer, drawerClasses } from '@mui/material';

import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import {Link} from 'react-router-dom';

import ProjectLogo from '../UI/ProjectLogo';
import { FrontendContext } from "../../Internals/ContextStore";
import DashboardPages, {DashboardMenuProps}  from './DashboardHelpers';

//This is to make it possible for the side menu props to be optional
interface SideMenuProps {
  currentDashboardPage: DashboardPages;
  setCurrentDashboardPage: React.Dispatch<React.SetStateAction<DashboardPages>>;
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
}


const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const SideMenu: React.FC<SideMenuProps> = ({
  currentDashboardPage,
  setCurrentDashboardPage,
  variant = 'permanent', // Default to permanent for larger screens
  open = true, // For permanent, the drawer is always open
  onClose = () => {} // No-op for permanent drawer
}) => {
  const frontendContext = useContext(FrontendContext);

  return (
    <Drawer
    variant={variant}
    open={open}
    onClose={onClose}
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
      },
    }}
    >
      <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
          <Link style={{textDecoration: 'none'}} to="/">
              <img style={{width: 100, height: 100, alignSelf: 'center'}} src={"/assets/images/project/ProjectLogo-Trim.png"} alt="logo" />
              <Typography sx={{
                              textAlign: 'center',
                              mr: 2,
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: 'black',
                          }} variant="h6" component="h2" gutterBottom>
                  WildVision
              </Typography>
          </Link>
      </div>
      <Box
        sx={{
          display: 'flex',
          p: 1.5,
        }}
      >
        
      </Box>
      <Divider />

      <MenuContent currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage} /> {/* This renders a List of pages the user can navigate to from the dashboard */}
      
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={frontendContext.user.contextRef?.current.username}
          sx={{ width: 36, height: 36 }}
        >{frontendContext.user.contextRef?.current.initials}</Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {frontendContext.user.contextRef?.current.username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {frontendContext.user.contextRef?.current.email}
          </Typography>
        </Box>
        <OptionsMenu  currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage}/>
      </Stack>
    </Drawer>
  );
}

export default SideMenu;