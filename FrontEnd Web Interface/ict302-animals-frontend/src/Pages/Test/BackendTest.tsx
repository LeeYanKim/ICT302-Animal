import React, {useContext} from 'react';

import { UserProfileContext } from "../../Internals/ContextStore";

import { Box, Button, Container, Grid, Typography } from '@mui/material';

const BackendTest: React.FC = () => {
    const userContext = useContext(UserProfileContext);

    const handelConnectionTest = async () => {
        try {
            const response = await fetch('http://localhost:5173/api/test');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }

    }

    const handelDBConnectionTest = async () => {
        try {
            const response = await fetch('http://localhost:5173/api/db/animals');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <div>
            <h1>Backend Test</h1>
            <div>
                <Button onClick={handelConnectionTest}>Test Backend Connection</Button>
                <Button onClick={handelDBConnectionTest}>Test DB Connection</Button>
            </div>
        </div>
    );
}

export default BackendTest;