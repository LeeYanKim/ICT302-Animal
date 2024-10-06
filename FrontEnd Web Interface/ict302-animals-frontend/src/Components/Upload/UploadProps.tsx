import React from 'react';
import  UserAlert  from '../../Internals/components/Alerts/Alert';


export interface UploadProps {
    alertQueue: any;
    setAlertQueue: any;
    onUploadSuccess: () => void;  // Add this prop for the upload success trigger
  }