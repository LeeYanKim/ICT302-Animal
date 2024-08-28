import React from 'react';
import ModelLoader from "../Components/ModelLoader";

function View() {
  return (
    <div className="view-container">
      <ModelLoader url="/3d_test_files/toon_cat_free/scene.gltf"/>
    </div>
  );
}

export default View;
