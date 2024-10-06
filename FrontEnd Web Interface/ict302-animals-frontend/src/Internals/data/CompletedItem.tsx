export default class CompletedItem {
    id: string;
    name: string;
    size: number;
    type: string;
    status: string;
    modelPath: string;

    constructor(id: string, name: string, size: number, type: string, progress: number, status: string, modelPath: string) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.status = status;
        this.modelPath = modelPath;
    }
}