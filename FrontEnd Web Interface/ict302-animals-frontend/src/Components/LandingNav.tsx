import React, {useContext, useState} from "react";
import { Link } from 'react-router-dom';

import {AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Button, Tooltip, Container} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';

import {ThemeProvider} from "@mui/material/styles";
import AppTheme  from "./UI/Theme";
import {UserProfileContext} from "../Internals/ContextStore";

import './LandingNav.css';

const pages = ['Home', 'About', 'Contact']; // TODO Add any other pages here, Must match the routes in App.tsx

const settings = ['Account', 'Dashboard', 'SignOut']; // TODO Add any other settings here


const LandingNav: React.FC= () => {
    const userContext = useContext(UserProfileContext);

    const [mode, setMode] = useState('light');

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        console.log('closing nav menu');
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    console.log(userContext)

    return (
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> {/* TODO Replace with team logo */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            WildVision
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page}>
                                        <Link to={page.toLowerCase()}>
                                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <PetsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> {/* TODO Replace with team logo */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            WildVision
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    component={Link}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                    to={page.toLowerCase()}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        {userContext.valid && userContext.contextRef?.current.loggedInState ?
                        <Box sx={{ flexGrow: 0 }}> {/* TODO Replace with user avatar */}
                            <Tooltip title="Open Profile">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={userContext.contextRef?.current.username}>{userContext.contextRef?.current.initials}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting}>
                                        <Link to={setting.toLowerCase() === 'account' ? '/dashboard/account' : setting.toLowerCase()}>
                                            <Typography sx={{ textAlign: 'center' }} >{setting}</Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                        
                            </Menu>
                        </Box>
                        : 
                        <Box sx={{ flexGrow: 0 }}>
                            <Button
                            component={Link}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            to={'/signin'}
                            >
                                Sign-In
                            </Button>
                        </Box>
                        }
                    </Toolbar>
                </Container>
            </AppBar>
    );
}
export default LandingNav;
