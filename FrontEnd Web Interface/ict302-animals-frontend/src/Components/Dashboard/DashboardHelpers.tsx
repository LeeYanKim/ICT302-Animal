import React from 'react';
import About from '../../Pages/About';
import Account from '../../Pages/Account';
import Completed from '../../Pages/Completed';
import Feedback from '../../Pages/Feedback';
import Help from '../../Pages/Help';
import Queue from '../../Pages/Queue';
import Upload from '../../Pages/Upload';
import Settings from '../../Pages/Settings';
import Contact from '../../Pages/Contact';
import SignIn from '../../Pages/SignIn';
import SignUp from '../../Pages/SignUp';
import SignOut from '../../Pages/SignOut';
import MainGrid from './MainGrid';
import Animals from '../../Pages/Animals';




enum DashboardPages {
    Home, Upload,  Settings, About, Feedback, Help, Account, Animals
}

export function getDashboardPageFromName(page: string): DashboardPages {
    switch (page) {
        case 'home':
            return DashboardPages.Home;
        case 'upload':
            return DashboardPages.Upload;
        case 'settings':
            return DashboardPages.Settings;
        case 'about':
            return DashboardPages.About;
        case 'feedback':
            return DashboardPages.Feedback;
        case 'help':
            return DashboardPages.Help;
        case 'account':
            return DashboardPages.Account;
        case 'animals':
            return DashboardPages.Animals;
        default:
            return DashboardPages.Home;
    }
}

export function getNameFromDashboardPage(page: DashboardPages) {
    switch (page) {
        case DashboardPages.Home:
            return 'home';
        case DashboardPages.Upload:
            return 'upload';
        case DashboardPages.Settings:
            return 'settings';
        case DashboardPages.About:
            return 'about';
        case DashboardPages.Feedback:
            return 'feedback';
        case DashboardPages.Help:
            return 'help';
        case DashboardPages.Account:
            return 'account';
        case DashboardPages.Animals:
            return 'animals';
    }
}

export function getPrettyNameFromDashboardPage(page: DashboardPages) {
    switch (page) {
        case DashboardPages.Home:
            return 'Home';
        case DashboardPages.Upload:
            return 'Upload';
        case DashboardPages.Settings:
            return 'Settings';
        case DashboardPages.About:
            return 'About';
        case DashboardPages.Feedback:
            return 'Feedback';
        case DashboardPages.Help:
            return 'Help';
        case DashboardPages.Account:
            return 'Account';
        case DashboardPages.Animals:
            return 'Animals';
    }
}

export function getDashboardPageFromPath(path: string): DashboardPages {
    const page = path.split('/').pop();
    if (page) {
        return getDashboardPageFromName(page);
    }
    return DashboardPages.Home;
}

export function getDashboardPageRenderFromDashboardPage(page: DashboardPages, alertQueue: React.ReactNode[], setAlertsQueue: any, onUploadSuccess?: () => void) {
    const handleUploadSuccess = onUploadSuccess ?? (() => {});
    switch (page) {
        case DashboardPages.Home:
            return <MainGrid />;
        case DashboardPages.Upload:
            return <Upload alertQueue={alertQueue} setAlertQueue={setAlertsQueue} onUploadSuccess={handleUploadSuccess}/>;
        case DashboardPages.Settings:
            return <Settings />;
        case DashboardPages.About:
            return <About />;
        case DashboardPages.Feedback:
            return <Feedback />;
        case DashboardPages.Help:
            return <Help />;
        case DashboardPages.Account:
            return <Account />;
        case DashboardPages.Animals:
            return <Animals />;
        default:
            return <MainGrid />;
    }
}

export interface DashboardMenuProps {
    currentDashboardPage: DashboardPages;
    setCurrentDashboardPage: any;
}

export default DashboardPages;