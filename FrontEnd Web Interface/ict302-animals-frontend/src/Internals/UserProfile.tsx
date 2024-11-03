import QueueItem  from './data/QueueItem';
import CompletedItem from './data/CompletedItem';
import {Animal} from '../Components/Animal/AnimalInterfaces';

export default class UserProfile {
    userId : string
    username: string
    email: string
    initials: string
    loggedInState: boolean = false;
    currentItemsInQueue: number = 0;
    currentItemsInProcessQueue: QueueItem[] = [];
    currentCompletedItems: number = 0;
    completedItems: CompletedItem[] = [];
    userAnimals: Animal[] = [];

    constructor(username: string = 'No Username', email: string = 'No Email', initials: string = 'NN', loggedInState: boolean = false) {
        this.username = username ;
        this.email = email;
        this.initials = initials;
        this.loggedInState = loggedInState;
    }

    setLogedInState(loggedInState: boolean) {
        this.loggedInState = loggedInState;
    }
};