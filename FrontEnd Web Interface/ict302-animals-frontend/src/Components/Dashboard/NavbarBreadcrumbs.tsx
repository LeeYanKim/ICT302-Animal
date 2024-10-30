import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom'

import DashboardPages, {DashboardMenuProps, getPrettyNameFromDashboardPage}  from './DashboardHelpers';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const NavbarBreadcrumbs: React.FC<DashboardMenuProps> = ({currentDashboardPage, setCurrentDashboardPage}) => {
  const location = useLocation();
  let currentPath = location.pathname;
  let animalIDInPath = false;
  let animalID = '';
  if(currentPath.includes('/dashboard/animals/')) {
    animalIDInPath = true;
    animalID = currentPath.split('/').pop() || '';
  }
  

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {getPrettyNameFromDashboardPage(currentDashboardPage)}
      </Typography>
      {animalIDInPath && <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {animalID}
        </Typography>
        }
    </StyledBreadcrumbs>
  );
}

export default NavbarBreadcrumbs;