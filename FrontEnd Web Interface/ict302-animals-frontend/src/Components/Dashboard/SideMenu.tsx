import React, { useContext} from 'react';
import { styled, Avatar, Box, Divider, Stack, Typography, Drawer as MuiDrawer, drawerClasses } from '@mui/material';

import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';

import ProjectLogo from '../UI/ProjectLogo';
import { UserProfileContext } from "../../Internals/ContextStore";
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
  const userContext = useContext(UserProfileContext);

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