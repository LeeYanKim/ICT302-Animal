import React, { useContext} from 'react';
import { styled, Avatar, Box, Divider, Stack, Typography, Drawer as MuiDrawer, drawerClasses } from '@mui/material';

import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

import ProjectLogo from '../UI/ProjectLogo';
import { UserProfileContext } from "../../Internals/ContextStore";
import DashboardPages, {DashboardMenuProps}  from './DashboardHelpers';

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

const SideMenu: React.FC<DashboardMenuProps> = ({currentDashboardPage, setCurrentDashboardPage}) => {
  const userContext = useContext(UserProfileContext);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <ProjectLogo />
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
          alt={userContext.contextRef?.current.username}
          sx={{ width: 36, height: 36 }}
        >{userContext.contextRef?.current.initials}</Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {userContext.contextRef?.current.username}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {userContext.contextRef?.current.email}
          </Typography>
        </Box>
        <OptionsMenu  currentDashboardPage={currentDashboardPage} setCurrentDashboardPage={setCurrentDashboardPage}/>
      </Stack>
    </Drawer>
  );
}

export default SideMenu;