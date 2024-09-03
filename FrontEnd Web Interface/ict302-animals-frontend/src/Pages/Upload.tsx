import React, {useContext} from 'react';




import { UserProfileContext } from "../Internals/ContextStore";

import UploadPrompt from '../Components/Upload/UploadPrompt';
import {UploadProps} from '../Components/Upload/UploadProps';


const Upload: React.FC<UploadProps> = ({alertQueue, setAlertQueue }) => {
  const userContext = useContext(UserProfileContext);
  return (
    <div>
        <UploadPrompt alertQueue={alertQueue} setAlertQueue={setAlertQueue}/>
    </div>
  );
}

export default Upload;