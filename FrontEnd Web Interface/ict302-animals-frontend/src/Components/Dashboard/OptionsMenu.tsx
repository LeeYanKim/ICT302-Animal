import React from 'react';
import { styled, Divider, dividerClasses, Menu, MenuItem as MuiMenuItem, paperClasses, listClasses, ListItemText, ListItemIcon, listItemIconClasses, Button } from '@mui/material';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';

import DashboardPages, {DashboardMenuProps} from './DashboardHelpers';

import {Link, useNavigate} from 'react-router-dom';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

const OptionsMenu: React.FC<DashboardMenuProps> = ({currentDashboardPage, setCurrentDashboardPage}) => {
  const nav = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    //setCurrentDashboardPage(DashboardPages.Account);
    nav('/dashboard/account');
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <Divider />
        <Button
          component={Link}
          to="/signout"
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
          >
        <MenuItem
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: 'auto',
              minWidth: 0,
            },
          }}
        >
            <ListItemText>Logout</ListItemText>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
        </Button>
      </Menu>
    </React.Fragment>
  );
}

export default OptionsMenu;
