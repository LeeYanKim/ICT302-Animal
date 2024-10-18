import React, { ReactNode, createContext, useContext, createRef, useRef, useState, useEffect } from 'react';

/**
 * Internal class to define API endpoints
 */
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
    generate: string = '/generate';

    constructor(isDev: boolean, baseUrl: string) {
        this.isDev = isDev;
        this.baseUrl = baseUrl;
    }
}

/**
 * API class to provide endpoint URLs dynamically based on the environment
 * 
 * Note: This class should be used to get the endpoint URLs for the API calls
 * 
 * @example
 * API.Upload() // Returns the url for the File Upload controller endpoint
 * API.Animals() // Returns the url for the Animals controller endpoint
 * 
 */
class API {
    private static endpoint: APIEndpoints | undefined;
    private static devEndpointAddress = 'http://localhost:5173/api';
    private static prodEndpointAddress = 'https://api.wildvision.co/api'

    /**
     * Initialize the API endpoints based on the environment
     */
    public static init() {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            console.log('API calls are in: Development Mode');
            this.endpoint = new APIEndpoints(true, this.devEndpointAddress);
        }
        else {
            console.log('API calls are in: Production Mode');
            this.endpoint = new APIEndpoints(false, this.prodEndpointAddress);
        }
    }

    private static ensureInitialized() {
        if (!this.endpoint) {
            this.init();
        }
    }

    /**
     * 
     * @returns The base URL path for the API Animal controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/animals
     */
    public static Animals() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.animals;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API AccessType controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/accessType
     */
    public static AccessType() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.accessType;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API AnimalAccess controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/animalAccess
     */
    public static AnimalAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.animalAccess;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Billing controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/billing
     */
    public static Billing() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.billing;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Graphic controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/graphic
     */
    public static Graphic() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.graphic;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API JobDetails controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/jobDetails
     */
    public static JobDetails() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobDetails;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API JobPending controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/jobsPending
     */
    public static JobPending() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobPending;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API JobsCompleted controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/jobsCompleted
     */
    public static JobsCompleted() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.jobsCompleted;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Model3D controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/model3D
     */
    public static Model3D() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.model3D;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Organization controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/organization
     */
    public static Organization() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.organization;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API OrganizationAccess controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/organiationAccess
     */
    public static OrganizationAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.organizationAccess;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API OrgRequests controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/orgRequests
     */
    public static OrgRequests() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.orgRequests;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Subscription controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/subscription
     */
    public static Subscription() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.subscription;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API Transaction controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/transcation
     */
    public static Transaction() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.transaction;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API TransactionType controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/transcationType
     */
    public static TransactionType() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.transactionType;
        return base + db + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API User controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/user
     */
    public static User() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.user;
        return base + db + endpoint;
    }

    /**
     * 
     * @param userId The unique identifier for the user
     * @returns The URL for fetching a user by ID
     * 
     * Example: http://localhost:5173/api/db/user/{userId}
     */
    public static GetUserByID(userId: string) {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.user;
        return `${base}${db}${endpoint}/${userId}`;
    }

    /**
     * 
     * @returns The base URL path for the API UserAccess controller endpoint/s
     * 
     * Example: http://localhost:5173/api/db/userAccess
     */
    public static UserAccess() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const db = this.endpoint?.dbEndpoint ?? '';
        const endpoint = this.endpoint?.userAccess;
        return base + db + endpoint;
    }


    /**
     * 
     * @returns The base URL path for the API File Upload controller endpoint/s
     * 
     * Example: http://localhost:5173/api/upload
     */
    public static Upload() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.fileUpload;
        return base + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API File controller endpoint/s
     * 
     * Example: http://localhost:5173/api/files
     */
    public static Download() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.download;
        return base + endpoint;
    }

    /**
     * 
     * @returns The base URL path for the API File Upload controller endpoint/s
     * This can be used to delete animals in the FileUploadController
     * 
     * Example: http://localhost:5173/api/upload/animal/{animalId}
     */
    public static DeleteAnimal(animalId: string) {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.fileUpload;
        return `${base}${endpoint}/animal/${animalId}`;
    }

    /**
     * 
     * @returns The base URL path for deleting a specific graphic (video) associated with an animal
     * 
     * Example: http://localhost:5173/api/upload/animal/{animalId}/graphic/{graphicId}
     */
    public static DeleteGraphic(animalId: string, graphicId: string) {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.fileUpload;
        return `${base}${endpoint}/animal/${animalId}/graphic/${graphicId}`;
    }

    /**
     * 
     * @returns The base URL path for the API File controller endpoint/s
     * 
     * Example: http://localhost:5173/api/files
     */
    public static Generate() {
        this.ensureInitialized();
        const base = this.endpoint?.baseUrl ?? '';
        const endpoint = this.endpoint?.generate;
        return base + endpoint;
    }

}

export default API;