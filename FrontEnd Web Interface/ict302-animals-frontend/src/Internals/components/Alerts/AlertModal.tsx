import React from 'react';
import {Alert} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface AlertModalProps {
    icon: React.ReactNode;
    severity: "error" | "warning" | "info" | "success";
    message: string;
    progress?: number | null;
}

const AlertModal: React.FC<AlertModalProps> = ({ icon, severity, message, progress}) => {
  return (
    <Alert icon={icon} severity={severity}>
      {message}
      {progress && <progress value={progress} max="100" />}
    </Alert>
  );
}

export default AlertModal;