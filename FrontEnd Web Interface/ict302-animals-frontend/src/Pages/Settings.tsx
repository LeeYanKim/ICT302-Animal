import React, {useContext} from 'react';

import { FrontendContext } from "../Internals/ContextStore";
import {Link, useNavigate} from 'react-router-dom';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DeleteUserButton from '../Components/Settings/DeleteUserButton';



const Settings: React.FC = () => {
  const frontendContext = useContext(FrontendContext);
  const nav = useNavigate();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const HandleLogOut = () => {
    nav('/signout');
  };

  const handleDeleteSuccess = () => {
    // Implement your logic to refresh the graphics list or handle UI changes
    console.log('User deleted successfully');
    nav('/signout');
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      <h1>Settings</h1>
      
      <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Delete Account</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <DeleteUserButton onDeleteSuccess={handleDeleteSuccess} />        
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Log Out</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Do you want to log out of your account?
          </Typography>
          <Button variant="text" color="primary" onClick={HandleLogOut}>
            Log Out
          </Button>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Settings;