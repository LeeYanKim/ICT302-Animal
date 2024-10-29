import React, {useState, useEffect, useCallback, useContext, useMemo} from "react";
import { Button, Box, Typography, CircularProgress, Grid2 as Grid, Chip} from "@mui/material";
import API from "../../Internals/API";
import { FrontendContext} from "../../Internals/ContextStore";
import ModelViewer from "../ModelViewer/ModelViewer";

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
    const [jobProcessing, setJobProcessing] = useState<boolean>(false);
    const [modelData, setModelData] = useState<JobModel | null>(null);
    const jobStatusRefreshInterval = 1000; // This is in milliseconds

    const fetchJob = async () => {
        const response = await fetch(API.GenerationStatus() + "/graphic/" + graphicId);
        if (!response.ok) {
            console.log("Failed to fetch job data, there probably isnt one yet");
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
        if (jobData && jobData.status !== "Complete" && jobData.status !== "Failed") {
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
        if(jobData && jobData.status !== "Complete" && jobData.status !== "Failed")
            setTimeout(checkJobStatus, jobStatusRefreshInterval);

        if(jobData && jobData.status === "Complete")
            fetchModelData();
    },[jobData]);

    // Fetch model data
    async function fetchModelData() {
        if(jobData && jobData.status === "Complete") {
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
            <Button onClick={requestGeneration} variant="contained" color="primary">Generate</Button>
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
            <Box>
                <Grid container>
                    <Grid>
                        <Typography variant={'h4'}>Job Processing</Typography>
                    </Grid>
                    <Grid>
                        {jobProcessing ? <CircularProgress/> : null}
                    </Grid>
                </Grid>
                <Typography>Queue Position: {jobData?.queuePos}</Typography>
                <Chip label={jobData?.status} color={jobData ? GetStatusColor(jobData.status) : "default"}/>
            </Box>
        );
    }

    // View Generation Component
    const ViewGeneration = () =>{
        //
        return (
                <ModelViewer modelPath={modelData?.filePath} />
            );
        };

    return (
        <div key={graphicId}>
            {jobData ? (modelData ? <ViewGeneration/> : <GenerationStatus/>) : <GenerationRequestBtn/>}
        </div>
        );
    }

    export default Generation;
