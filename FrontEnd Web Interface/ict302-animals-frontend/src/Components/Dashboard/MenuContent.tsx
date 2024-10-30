import React, {useContext} from 'react';

import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Button, Badge} from '@mui/material';
import DashboardPages, {getDashboardPageFromName, getNameFromDashboardPage, DashboardMenuProps}  from './DashboardHelpers';

import { Link, useNavigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PetsIcon from '@mui/icons-material/Pets';

import { FrontendContext } from "../../Internals/ContextStore";

const MenuContent: React.FC<DashboardMenuProps> = ({currentDashboardPage, setCurrentDashboardPage}) => {

  const frontendContext = useContext(FrontendContext);

  const mainListItems = [
    //{ text: 'Home', icon: <HomeRoundedIcon /> },
    { text: 'Upload', icon: <CloudUploadIcon /> },
    { text: 'Animals', icon: <PetsIcon /> },
  ];
  
  const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon /> },
    { text: 'About', icon: <InfoRoundedIcon /> },
  ];

  const nav = useNavigate();

  const menuItemClicked = (page: string) => {
    setCurrentDashboardPage(getDashboardPageFromName(page));
    nav('/dashboard/' + page);
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Button
                onClick={() => menuItemClicked(item.text.toLowerCase())}
                >
              <ListItemButton selected={item.text.toLowerCase() === getNameFromDashboardPage(currentDashboardPage)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Button>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Button
                onClick={() => menuItemClicked(item.text.toLowerCase())}
                >
              <ListItemButton selected={item.text.toLowerCase() === getNameFromDashboardPage(currentDashboardPage)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Button>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default MenuContent;
