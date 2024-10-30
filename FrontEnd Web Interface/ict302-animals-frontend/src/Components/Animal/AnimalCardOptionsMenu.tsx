import React from "react";
import {AnimalCardOptionsMenuProps} from "./AnimalInterfaces";
import {IconButton, Divider, MenuItem, Typography} from "@mui/material";
import {Delete, Menu, KeyboardArrowDown} from "@mui/icons-material";
import StyledMenu from "./StyledMenu";
import API from "../../Internals/API";


const AnimalCardOptionsMenu: React.FC<AnimalCardOptionsMenuProps> = ({animalId, onDeleteSuccess}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const showAnimalCardOptions = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        event.stopPropagation();
        event.preventDefault();
    };

    //@ts-ignore
    const handleDelete = (e) => {
        async function deleteAnimal() {
            try {
                const response = await fetch(API.DeleteAnimal(animalId), {
                    method: 'DELETE',
                });

                if (response.ok) {
                    if (onDeleteSuccess) {
                        onDeleteSuccess();  // Call the success callback if provided
                    }
                    alert('Animal and associated videos deleted successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete animal: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting animal:', error);
                alert('An error occurred while deleting the animal.');
            }
        }
        e.stopPropagation();
        e.preventDefault();
        deleteAnimal();
    };


    return (
        <div style={{width: '20px', padding: '5px'}}>
            <IconButton
                aria-controls={showAnimalCardOptions ? 'animal card menu' : undefined}
                aria-haspopup="true"
                aria-expanded={showAnimalCardOptions ? 'true' : undefined}
                onClick={handleMenuOpen}>
                <Menu/>
            </IconButton>
            <StyledMenu
                key={animalId}
                id={'graphic-options-menu'}
                MenuListProps={{'aria-labelledby': 'graphics-option-button'}}
                anchorEl={anchorEl}
                open={showAnimalCardOptions}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleDelete} disableRipple sx={{color: 'red'}}>
                    <Delete/>
                    Delete Animal
                </MenuItem>
            </StyledMenu>
        </div>
    );
}

export default AnimalCardOptionsMenu;