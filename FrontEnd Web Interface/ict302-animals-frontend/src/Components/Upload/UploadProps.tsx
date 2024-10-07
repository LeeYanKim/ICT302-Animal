import React from 'react';
import  UserAlert  from '../../Internals/components/Alerts/Alert';


export interface UploadProps {
  alertQueue: any; // Replace `any` with a more specific type if possible for better type safety
  setAlertQueue: React.Dispatch<React.SetStateAction<any>>; // SetDispatch to match React useState signature
  onUploadSuccess: () => void;  // Callback function for successful upload
}