import React, {useContext} from 'react';

import { UserProfileContext } from "../../Internals/UserProfileProps";

interface DashboardPageDisplayProps {
    children?: React.ReactNode;
    pageDisplaying?: string;
}

const DashboardPageDisplay: React.FC<DashboardPageDisplayProps> = ({ children, pageDisplaying }) => {
  const userContext = useContext(UserProfileContext);
  return (
    <div>
        {children}
    </div>
  );
}

export default DashboardPageDisplay;