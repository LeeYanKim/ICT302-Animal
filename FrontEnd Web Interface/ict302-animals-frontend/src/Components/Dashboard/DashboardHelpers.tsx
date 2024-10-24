import React from 'react';
import About from '../../Pages/About';
//import Account from '../../Pages/Account';
import Upload from '../../Pages/Upload';
import Settings from '../../Pages/Settings';
import SignIn from '../../Pages/SignIn';
import SignUp from '../../Pages/SignUp';
import SignOut from '../../Pages/SignOut';
//import MainGrid from './MainGrid';
import Animals from '../../Pages/Animals';




enum DashboardPages {
    Upload, About, Settings, Help, Animals, AnimalDetails
}

// enum DashboardPages {
//     Home, Upload, About, Settings, Help, Animals, AnimalDetails
// }

export function getDashboardPageFromName(page: string): DashboardPages {
    switch (page) {
        //case 'home':
            //return DashboardPages.Home;
        case 'upload':
            return DashboardPages.Upload;
        case 'settings':
            return DashboardPages.Settings;
        case 'about':
            return DashboardPages.About;
        //case 'account':
            //return DashboardPages.Account;
        case 'animals':
            return DashboardPages.Animals;
        default:
            return DashboardPages.Upload;
    }
}

export function getNameFromDashboardPage(page: DashboardPages) {
    switch (page) {
        //case DashboardPages.Home:
            //return 'home';
        case DashboardPages.Upload:
            return 'upload';
        case DashboardPages.Settings:
            return 'settings';
        case DashboardPages.About:
            return 'about';
        //case DashboardPages.Account:
            //return 'Account';
        case DashboardPages.Animals:
            return 'animals';
    }
}

export function getPrettyNameFromDashboardPage(page: DashboardPages) {
    switch (page) {
        //case DashboardPages.Home:
            //return 'Home';
        case DashboardPages.Upload:
            return 'Upload';
        case DashboardPages.Settings:
            return 'settings';
        case DashboardPages.About:
            return 'About';
        //case DashboardPages.Account:
            //return 'Account';
        case DashboardPages.Animals:
            return 'Animals';
        case DashboardPages.AnimalDetails:
            return "Animals";
    }
}

export function getDashboardPageFromPath(path: string): DashboardPages {
    const page = path.split('/').pop();
    if (page) {
        return getDashboardPageFromName(page);
    }
    //return DashboardPages.Home;
    return DashboardPages.Upload;
}

export function getDashboardPageRenderFromDashboardPage(page: DashboardPages, alertQueue: React.ReactNode[], setAlertsQueue: any, onUploadSuccess?: () => void) {
    const handleUploadSuccess = onUploadSuccess ?? (() => {});
    switch (page) {
        //case DashboardPages.Home:
            //return <MainGrid />;
        case DashboardPages.Upload:
            return <Upload alertQueue={alertQueue} setAlertQueue={setAlertsQueue} onUploadSuccess={handleUploadSuccess}/>;
        case DashboardPages.Settings:
            return <Settings />;
        case DashboardPages.About:
            return <About />;
        //case DashboardPages.Account:
            //return <Account />;
        case DashboardPages.Animals:
            return <Animals actTab={0}/>;
        default:
            //return <MainGrid />;
            return <Upload alertQueue={alertQueue} setAlertQueue={setAlertsQueue} onUploadSuccess={handleUploadSuccess}/>;
    }
}

export interface DashboardMenuProps {
    currentDashboardPage: DashboardPages;
    setCurrentDashboardPage: any;
}

export default DashboardPages;