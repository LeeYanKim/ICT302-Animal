import React, {useContext} from 'react';
import { FrontendContext } from "../Internals/ContextStore";

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import NavigationIcon from '@mui/icons-material/Navigation';



interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

//const Enterprise: React.FC<TabPanelProps>= () => {
const Enterprise = () => {
  const frontendContext = useContext(FrontendContext);
//export default function FloatingActionButtonZoom() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  const packages = [
    { label: "Package One", storage: "500 GB /year", generator: "450 times" },
    { label: "Package Two", storage: "400 GB /year", generator: "350 times" },
    { label: "Package Three", storage: "200 GB /year", generator: "150 times" },
  ];


return (
  <Box sx={{ bgcolor: 'background.paper',width: 500,position: 'relative',minHeight: 200,}}>
  <AppBar position="static" color="default">
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      aria-label="action tabs example"
    >
      {packages.map((pkg, index) => (
        <Tab label={pkg.label} {...a11yProps(index)} key={index} />
      ))}
    </Tabs>
  </AppBar>

  {packages.map((pkg, index) => (
        <TabPanel value={value} index={index} dir={theme.direction} key={index}>
          {pkg.label}:<br />
          Storage: {pkg.storage}<br />
          3D Generator: {pkg.generator}
        </TabPanel>
      ))}

  <Fab variant="extended">
    <NavigationIcon sx={{ mr: 1 }} />
    Purchase
  </Fab>
</Box>
 
  );
}

export default Enterprise;