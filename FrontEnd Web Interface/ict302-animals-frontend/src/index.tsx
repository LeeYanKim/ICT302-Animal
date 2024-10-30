import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import UserProfile from './Internals/UserProfile';
import ContextStore from './Internals/ContextStore';

// Import of the Index CSS file
import './index.css';

// Import of the App component
import App from './App';


// Leave all code below this line as is and do not modify it
// General React code to render the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
  <React.StrictMode>
    <BrowserRouter>
        <ContextStore>
          <App />
        </ContextStore>
    </BrowserRouter>
    
  </React.StrictMode>
);

// General React code to track vitals the app
//reportWebVitals();