import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";
import { Button, Box, Typography, CircularProgress, LinearProgress, Grid2 as Grid, Chip, Card, CardContent, CardMedia} from "@mui/material";
import API from "../../Internals/API";
import { FrontendContext} from "../../Internals/ContextStore";
import ModelViewer from "../ModelViewer/ModelViewer";
import {AccessTime, Folder} from "@mui/icons-material";
import moment from "moment/moment";
import Stack from "@mui/material/Stack";

interface GenerationProps {
    graphicId: string;
    animalId: string;
    graphicFileName: string;
}

interface JobData {
    jobId: string;
    status: string;
    queuePos: number;
}

interface JobModel {
    modelId: string;
    modelTitle: string;
    modelDateGen: string;
    filePath: string;
}

const Generation: React.FC<GenerationProps> = ({graphicId, animalId, graphicFileName}) => {
    const frontendContext = useContext(FrontendContext);
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [jobRequested, setJobRequested] = useState<boolean>(false);
    const [jobProcessing, setJobProcessing] = useState<boolean>(true);
    const [modelData, setModelData] = useState<JobModel | null>(null);
    const jobStatusRefreshInterval = 1000; // This is in milliseconds

    const [genProgress, setGenProgress] = useState<number>(0);

    const getProgressFromStatus = (status: string) => {
        switch(status) {
            case "Submitted":
                return 0;
            case "Validating":
                return 10;
            case "PreProcessing":
                return 20;
            case "Evaluating":
                return 30;
            case "Masking":
                return 40;
            case "Generating":
                return 50;
            case "Converting":
                return 60;
            case "CleaningUp":
                return 70;
            case "Finished":
                return 80;
            case "Fetching":
                return 90;
            case "Closing":
                return 95;
            case "Closed":
                return 100;
            case "Complete":
                return 100;
            default:
                return 0;
        }
    }

    const formatUploadedDate = (date : string) => {
        let d = moment(date, 'YYYY-MM-DDTHH:mm:ss');
        return d.format('DD/MM/YYYY');
    }

    const fetchJob = async () => {
        const response = await fetch(API.GenerationStatus() + "/graphic/" + graphicId);
        if (!response.ok) {
            return;
        }
        await response.json().then((job) => setJobData({jobId: job.jobID, status: job.status, queuePos: job.queuePos? job.queuePos : 0}));
    }

    // Fetch job data on component mount
    useEffect(() => {
        if(jobData === null) {
            fetchJob();
        }
    });

    // Check job status
    async function checkJobStatus() {
        if (jobData && jobData.status !== "Complete" && jobData.status !== "Failed" && jobData.jobId !== "") {
            try{
                await fetchJob();
            }
            catch (error) {
                console.error("Error checking job status:", error);
            }
        }
    }

    // Update job data when it changes
    useEffect(() => {
        if(jobData && jobData.jobId !== "" && jobData.status !== "Complete" && jobData.status !== "Failed")
            setTimeout(checkJobStatus, jobStatusRefreshInterval);

        if(jobData && jobData.jobId !== ""&& jobData.status === "Complete")
            fetchModelData();
    },[jobData]);

    // Fetch model data
    async function fetchModelData() {
        if(jobData && jobData.jobId !== "" && jobData.status === "Complete") {
            const fetchModel = async () => {
                const response = await fetch(API.Download() + '/animals/models/graphics/' + graphicId);
                if (!response.ok) {
                    console.error("Failed to fetch model data");
                    return;
                }
                await response.json().then(
                    (model) => setModelData({modelId: model.modelID, modelTitle: model.modelTitle, modelDateGen: model.modelDateGen, filePath: model.filePath}));

            }
            await fetchModel();
        }
    }

    // Request model generation
    const requestGeneration = async () => {
        try{
            const res = await fetch(API.Generate(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }, body: JSON.stringify({
                    AnimalId: animalId,
                    AnimalGraphicFileName: graphicFileName,
                    GraphicId: graphicId,
                    GenType: "BITE",
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to request model generation");
            }
            const jobRequested = await res.json();
            console.log(jobRequested);
            setJobRequested(true);
            setJobData(jobRequested);
            setJobProcessing(true);
        }
        catch (error) {
            console.error("Error requesting model generation:", error);
        }

    };

    // Generation Request Button Component
    const GenerationRequestBtn = () =>{
        // TODO: add hook to handle generation request loading state
        return (
            <Box sx={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Button onClick={requestGeneration} variant="contained" color="primary">Generate</Button>
            </Box>
        );
    }

    function GetStatusColor(status: string) :"default" | "primary" | "secondary" | "info" | "success" | "error" | "warning" | undefined {

        switch(status) {
            case "Submitted":
                return "default";
            case "Validating":
                return "primary";
            case "PreProcessing":
                return "primary";
            case "Evaluating":
                return "primary";
            case "Masking":
                return "primary";
            case "Generating":
                return "secondary";
            case "Converting":
                return "info";
            case "CleaningUp":
                return "info";
            case "Finished":
                return "success";
            case "Fetching":
                return "success";
            case "Closing":
                return "success";
            case "Error":
                return "error";
            case "Closed":
                return "success";
            case "Complete":
                return "success";
            default:
                return "default";
        }
    }

    // Generation Status Component
    const GenerationStatus = () => {
        return (
            <Box sx={{height: '100%'}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant={'h4'}>Job Processing</Typography>
                </Box>
                {jobProcessing ? (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color="success"/>
                    </Box>
                ) : null}
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Stack>
                        <Typography>Queue Position: {jobData?.queuePos ? jobData?.queuePos : '...'}</Typography>
                        <Typography>Status: <Chip label={jobData?.status ? jobData?.status : 'Submitted'} color={jobData ? GetStatusColor(jobData.status ? jobData.status : 'Submitted') : "default"}/></Typography>
                    </Stack>
                </Box>
            </Box>
        );
    }

    const prefetchModel = async () => {
        const res = await fetch(modelData?.filePath ? modelData.filePath : "");
        if(!res.ok)
        {
            throw new Error("Failed to load model file")
        }

    }
    // View Generation Component
    const ViewGeneration = () =>{
        if(modelData && modelData.filePath !== "" ) {
            const pf = async () =>{
                await prefetchModel();
            }
            pf();
            return (
                <Card sx={{height: 'auto'}}>
                    <CardMedia>
                        <ModelViewer modelPath={modelData?.filePath}/>
                    </CardMedia>
                    <CardContent>
                        <Grid container spacing={4} >
                            <Grid size={6}>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', textAlign: 'center'}}>
                                    <AccessTime sx={{paddingTop: '6px'}}/>Generated: {formatUploadedDate(modelData?.modelDateGen)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            );
        }
        else
        {
            throw new Error("Failed to load model data");
        }
    };

    return (
        <div key={graphicId} style={{width: '100%', height: '100%'}}>
            {jobData && jobData.jobId !== "" ? (modelData ? <ViewGeneration/> : <GenerationStatus/>) : <GenerationRequestBtn/>}
        </div>
        );
    }

    export default Generation;
