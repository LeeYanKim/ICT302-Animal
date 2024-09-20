import React, {useContext} from 'react';
import ModelViewer from "../Components/ModelViewer/ModelViewer";

import { UserProfileContext } from "../Internals/ContextStore";


const View: React.FC = () => {
  const userContext = useContext(UserProfileContext);
  return (
    <div>
      <ModelViewer modelPath={'/3d_test_files/toon_cat_free.glb'}/>
    </div>
  );
}



export default View;