import React, {useContext} from 'react';
import ModelViewer from "../Components/ModelViewer/ModelViewer";

import { UserProfileContext } from "../Internals/ContextStore";


const View: React.FC = () => {
  const userContext = useContext(UserProfileContext);
  return (
    <div>
      <ModelViewer />
    </div>
  );
}

export default View;