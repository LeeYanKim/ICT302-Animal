import React, {useContext, useState} from 'react';

import { UserProfileContext } from "../../Internals/ContextStore";
import { SVGProps } from 'react';

import { Box, Button, Container, Grid, Typography} from '@mui/material';

const BackendTest: React.FC = () => {
    const userContext = useContext(UserProfileContext);

    const [img, setImg] = useState<string>('');
    const [animals, setAnimals] = useState<[]>([]);

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
            setAnimals(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }

    }

    const handleGetVideoTest = async () => {
        try {
            const response = await fetch('http://localhost:5173/api/user/files/videoTest.mp4');
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
                <Button variant='contained' onClick={handelConnectionTest}>Test Backend Connection</Button>
                <Button variant='contained' onClick={handelDBConnectionTest}>Test DB Connection</Button>
                <Button variant='contained' onClick={handleGetVideoTest}>Test Video Get</Button>
            </div>
            <div>
                {
                    animals && animals.map((animal: any, index: number) => {
                        return (
                            <div key={index}>
                                <p>{animal.animalID}</p>
                                <p>{animal.animalName}</p>
                                <p>{animal.animalType}</p>
                                <p>{animal.animalDOB}</p>
                            </div>
                        )
                    })
                }
            </div>
            {
                img && <video src={img} controls/>
            }


        </div>
    );
}

export default BackendTest;