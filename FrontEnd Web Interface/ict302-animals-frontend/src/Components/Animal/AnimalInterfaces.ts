import React from "react";

export interface Graphic {
    gpcid: string;
    gpcName: string;
    gpcDateUpload: string;
    filePath: string;
    animalID: string;
    gpcSize: number;
}

export interface Animal {
    animalID: string;
    animalName: string;
    animalType: string;
    animalDOB: string;
    graphics: Graphic[]; // Updated to include media files as graphics array
    photoFileName?: string;
}

// Type Definitions
export interface AnimalDetailsProps {
    animalId: string | null;
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    setSelectedAnimalId: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface GraphicsOptionMenuProps {
    graphic: Graphic;
}

export interface AnimalCardOptionsMenuProps {
    animalId: string;
    onDeleteSuccess?: () => void;  // Optional callback for success
}