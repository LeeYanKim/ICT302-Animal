import React, {useEffect} from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

interface AlertProps {
  icon: React.ReactNode;
  severity:  "success" | "info" | "warning" | "error" ;
  message: string;
  progress?: number | null;
}

const UserAlert: React.FC<AlertProps> = ({ icon, severity, message, progress}) => { 
  return (
    <div>    
      { severity &&
        <Alert sx={{ position: 'absolute', left: '50%', top: 100}} icon={icon} severity={severity} color={severity} variant="filled">
          {message}
          {progress && <progress value={progress} max="100" />}
        </Alert>
      }
    </div >

  );
}

export default UserAlert;