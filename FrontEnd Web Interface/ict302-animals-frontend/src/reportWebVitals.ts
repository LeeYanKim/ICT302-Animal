import {onCLS, onINP, onLCP} from 'web-vitals';

const reportWebVitals = () => {
    onLCP(console.log);
    onINP(console.log);
    onCLS(console.log);
};

export default reportWebVitals;
