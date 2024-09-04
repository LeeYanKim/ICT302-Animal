// Note: QueueItem class
export default class QueueItem {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: string;

    constructor(id: string, name: string, size: number, type: string, progress: number, status: string) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.type = type;
        this.progress = progress;
        this.status = status;
    }

    
}