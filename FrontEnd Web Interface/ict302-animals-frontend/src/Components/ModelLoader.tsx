import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import Scene from './canvas/Scene';
import Model from './canvas/Model';

import './canvas/Scene.css';

const ModelLoader = ({url}: {url: string}) => {
    const [isAnimating, setIsAnimating] = useState(true);

    const handlePlayPause = () => {
      setIsAnimating(!isAnimating);
    };
  
    return (
      <div className="render-container">
        <Scene>
          <Model url={url} isAnimating={isAnimating} />
        </Scene>
        <div className="controls">
          <button onClick={handlePlayPause}>
            {isAnimating ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    );
};


export default ModelLoader;