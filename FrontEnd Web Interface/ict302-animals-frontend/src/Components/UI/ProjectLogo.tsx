import React from 'react';
import {Link} from 'react-router-dom';
import { Typography } from '@mui/material';

import PetsIcon from '@mui/icons-material/Pets';

export default function ProjectLogo() {

    const logoPath = "/assets/images/project/ProjectLogo-trim.png";

    return (
        <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <Link style={{textDecoration: 'none'}} to="/">
                <img style={{width: 100, height: 100, alignSelf: 'center'}} src={logoPath} alt="logo" />
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
    );
}

export function ProjectLogoMin() {
    const logoPath = "/assets/images/project/ProjectLogo-trim.png";

    return (
        <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
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
        </div>
    );
}