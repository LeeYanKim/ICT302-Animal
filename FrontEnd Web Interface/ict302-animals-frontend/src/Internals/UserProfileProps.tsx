import { createContext, useRef } from 'react';
import UserProfile from './UserProfile';

export const UserProfileContext = createContext(new UserProfile());