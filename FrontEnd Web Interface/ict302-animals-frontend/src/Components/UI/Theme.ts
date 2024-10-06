import * as React from 'react';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import {alpha, getContrastRatio} from "@mui/material";

// https://mui.com/material-ui/customization/palette/#typescript

// Augment the palette to include custom colours
declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const AppTheme  = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: '#e3dfdc',
            contrastText: '#000',
        },
        secondary: {
            main: '#f50057',
            contrastText: '#000',
        },
        text: {
            primary: '#000',
            secondary: '#000',
        }
    }
});

export default AppTheme;