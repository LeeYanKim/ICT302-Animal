import React, {useContext} from 'react';

import { FrontendContext } from "../Internals/ContextStore";

const About: React.FC = () => {
  const frontendContext = useContext(FrontendContext);

  return (
    <div style={{ padding: '0 20px' }}>
      <h1>About</h1>
      <p>
        Welcome to <strong>WildVision</strong>, where the beauty and complexity of the animal kingdom come to life in 3D. Our platform empowers users to explore and learn about wildlife like never before, using cutting-edge technology to generate realistic 3D models from simple videos.
      </p>
      <h2>Our Mission</h2>
      <p>
        At WildVision, we aim to help users learn more about the animals based on the 3D Models generated.
      </p>
      <h2>What We Do</h2>
      <p>
        By utilizing advanced 3D modeling technology and data analysis, WildVision transforms ordinary photos and videos into lifelike animal models. Whether you're a wildlife enthusiast, a student, or a researcher, our platform allows you to dive into the details of various animals, offering insights and interactive experiences.
      </p>
      <h2>Why WildVision?</h2>
      <p>
        We combine technology and everyday life aiming to make it more convenient for users who are interested to get a scan of their animals. 
      </p>
    </div>
  );
}

export default About;
