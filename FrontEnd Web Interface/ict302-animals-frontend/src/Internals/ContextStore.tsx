import React, {ReactNode, createContext, useContext, createRef, useRef, useState, useEffect} from 'react';
import UserProfile from './UserProfile';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';


export type Context = {
    user: User;
    firebaseRef: React.MutableRefObject<FirebaseApp>;
    firebaseAuth: React.MutableRefObject<Auth>;
}

export type User = {
    valid: boolean;
    contextRef: React.MutableRefObject<UserProfile>;
}

export const FrontendContext = createContext<Context>({} as Context);

interface ContextStoreProps {
    children: ReactNode;
}

const ContextStore: React.FC<ContextStoreProps> = ({children}) => {
    const userRef = useRef<UserProfile>(new UserProfile());
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_PROJECT_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };
    const firebaseRef = useRef<FirebaseApp>(initializeApp(firebaseConfig));
    const firebaseAuth = useRef<Auth>(getAuth(firebaseRef.current));

    const [context, setContext] = useState<Context>({user: {valid: false, contextRef: userRef} as User, firebaseRef: firebaseRef, firebaseAuth: firebaseAuth});


    return (
        <FrontendContext.Provider value={context}>
            {children}
        </FrontendContext.Provider>
    )
}

export default ContextStore;