/* This is a temporary user profile object for testing purposes */

export default class UserProfile {
    username: string
    email: string
    initials: string
    loggedInState: boolean = false;

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