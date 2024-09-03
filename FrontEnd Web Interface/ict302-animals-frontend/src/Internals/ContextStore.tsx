import React, {ReactNode, createContext, useContext, createRef, useRef, useState, useEffect} from 'react';
import UserProfile from './UserProfile';

export type User = {
    valid: boolean;
    contextRef: React.MutableRefObject<UserProfile>;
}

export const UserProfileContext = createContext<User>({} as User);

interface ContextStoreProps {
    children: ReactNode;
}

const ContextStore: React.FC<ContextStoreProps> = ({children}) => {
    const userContextRef = useRef<UserProfile>(new UserProfile());
    const [userContext, setUserContext] = useState({valid: false, contextRef: userContextRef} as User);

    return (
        <UserProfileContext.Provider value={userContext}>
            {children}
        </UserProfileContext.Provider>
    )
}

export default ContextStore;