import React, {useContext, useState} from 'react';

import { UserProfileContext } from "../../Internals/ContextStore";
import { SVGProps } from 'react';

import { Box, Button, Container, Grid, Typography} from '@mui/material';

const BackendTest: React.FC = () => {
    const userContext = useContext(UserProfileContext);

    const [img, setImg] = useState<string>('');

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
            const response = await fetch('http://10.51.33.25:5000/api/db/animals');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }

    }

    const handleGetVideoTest = async () => {
        try {
            const response = await fetch('http://localhost:5173/api/user/files/Recording 2024-08-28 181442.mp4&video%2Fmp4');
            const data = await response.blob();
            let d = URL.createObjectURL(data);
            setImg(d);
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
                <Button onClick={handleGetVideoTest}>Test Video Get</Button>
            </div>
            {
                img && <video src={img} controls/>
            }


        </div>
    );
}

export default BackendTest;