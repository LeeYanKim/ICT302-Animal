import React, {ReactNode, createContext, useContext, createRef, useRef, useState, useEffect} from 'react';

class APIEndpoints {
    isDev: boolean;
    baseUrl: string = '';
    dbEndpoint: string = '/db';
    fileUpload: string = '/upload';
    download: string = '/files';
    animals: string = '/animals';
    accessType: string = '/accessType';
    animalAccess: string = '/animalAccess';
    billing: string = '/billing';
    graphic: string = '/graphic';
    jobDetails: string = '/jobDetails';
    jobPending: string = '/jobPending';
    jobsCompleted: string = '/jobsCompleted';
    model3D: string = '/model3D';
    organization: string = '/organization';
    organizationAccess: string = '/organizationAccess';
    orgRequests: string = '/orgRequests';
    subscription: string = '/subscription';
    transaction: string = '/transaction';
    transactionType: string = '/transactionType';
    user: string = '/user';
    userAccess: string = '/userAccess';

    constructor(isDev: boolean, baseUrl: string) {
        this.isDev = isDev;
        this.baseUrl = baseUrl;
    }
}

class API {
    private static endpoint: APIEndpoints | undefined;
    private static devEndpointAddress = 'http://localhost:5173/api';
    private static prodEndpointAddress = 'https://api.wildvision.co/api'

    public static init() {
        if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
        {
            console.log('Development Mode');
            this.endpoint = new APIEndpoints(true, this.devEndpointAddress);
        }
        else
        {
            console.log('Production Mode');
            this.endpoint = new APIEndpoints(false, this.prodEndpointAddress);
        }
    }

    private static ensureInitialized() {
        if(!this.endpoint) {
            this.init();
        }
    }

    public static Animals() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.animals;
        return base + db + endpoint;
    }

    public static AccessType() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.accessType;
        return base + db + endpoint;
    }

    public static AnimalAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.animalAccess;
        return base + db + endpoint;
    }

    public static Billing() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.billing;
        return base + db + endpoint;
    }

    public static Graphic() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.graphic;
        return base + db + endpoint;
    }

    public static JobDetails() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobDetails;
        return base + db + endpoint;
    }

    public static JobPending() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobPending;
        return base + db + endpoint;
    }

    public static JobsCompleted() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobsCompleted;
        return base + db + endpoint;
    }

    public static Model3D() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.model3D;
        return base + db + endpoint;
    }

    public static Organization() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.organization;
        return base + db + endpoint;
    }

    public static OrganizationAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.organizationAccess;
        return base + db + endpoint;
    }

    public static OrgRequests() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.orgRequests;
        return base + db + endpoint;
    }

    public static Subscription() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.subscription;
        return base + db + endpoint;
    }

    public static Transaction() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.transaction;
        return base + db + endpoint;
    }

    public static TransactionType() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.transactionType;
        return base + db + endpoint;
    }

    public static User() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.user;
        return base + db + endpoint;
    }

    public static UserAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.userAccess;
        return base + db + endpoint;
    }
    

    public static Upload() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.fileUpload;
        return base + endpoint;
    }

    public static Download() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.download;
        return base + endpoint;
    }

}

export default API;