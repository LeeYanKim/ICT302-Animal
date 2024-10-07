import React, {useContext} from 'react';

import { FrontendContext } from "../../Internals/ContextStore";

interface DashboardPageDisplayProps {
    children?: React.ReactNode;
    pageDisplaying?: string;
}

const DashboardPageDisplay: React.FC<DashboardPageDisplayProps> = ({ children, pageDisplaying }) => {
  const frontendContext = useContext(FrontendContext);
  return (
    <div>
        {children}
    </div>
  );
}

export default DashboardPageDisplay;