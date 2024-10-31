import React from 'react';
import {GraphicsOptionMenuProps} from "./AnimalInterfaces";
import {Button, Divider, MenuItem, Typography} from "@mui/material";
import {AccessTime, Delete, Download, Folder, KeyboardArrowDown} from "@mui/icons-material";
import StyledMenu from "./StyledMenu";
import API from "../../Internals/API";

const GraphicOptionsMenu: React.FC<GraphicsOptionMenuProps> = ({graphic}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const showGraphicSettings = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    const handleDownload = () => {
        window.location.href = graphic.filePath;
        handleMenuClose();
    }

    const handleDelete = () => {
        const del = async () => {
            try {
                const response = await fetch(API.Graphic() + "/" + graphic.gpcid, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    console.log('Graphic deleted successfully');
                } else {
                    console.error('Failed to delete graphic');
                }
            } catch (error) {
                console.error('Failed to delete graphic:', error);
            }
        }
        del();
        handleMenuClose();
    }

    return(
        <div>
            <Button
                aria-controls={showGraphicSettings ? 'graphic details menu' : undefined}
                aria-haspopup="true"
                aria-expanded={showGraphicSettings ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDown />}>
                Media Options
            </Button>
            <StyledMenu
                key={graphic.gpcid}
                id={'graphic-options-menu'}
                MenuListProps={{'aria-labelledby': 'graphics-option-button'}}
                anchorEl={anchorEl}
                open={showGraphicSettings}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleDownload} disableRipple>
                    <Download />
                    Download
                </MenuItem>
                <Divider sx={{ my: 0.5 }}/>
                <MenuItem onClick={handleDelete} disableRipple sx={{color: 'red'}}>
                    <Delete />
                    Delete
                </MenuItem>
            </StyledMenu>
        </div>
    );
}

export default GraphicOptionsMenu;