export class Summary {
    id:number;
    taskType:string;
    task:string;
    totalCount:number ;
    totalTime:number;
    uph:number = 0;

    constructor(id:number, taskType:string, task:string, totalCount:number, totalTime:number, uph:number) {
        this.id = id;
        this.taskType = taskType;
        this.task = task;
        this.totalCount = totalCount;
        this.totalTime = totalTime;
        this.uph = uph;
    }

    
    setTaskType = (taskType:string) => {
        this.taskType = taskType;
    }

    setTask = (task:string) => {
        this.task = task;
    }

    setTotalCount = (totalCount:number) => {
        this.totalCount = totalCount;
    }
    
    setTotalTime = (totalTime:number)=>{
        this.totalTime = totalTime;
    }

    setUph = ()=> {
        this.uph = 0;
    }

    getTaskType = () => {
        return this.taskType;
    }

    getTask = () => {
        return this.task;
    }

    getTotalCount = () => {
        return this.totalCount ;
    }
    getTotalTime = ()=>{
        return this.totalTime ;
    }

    increaseCount = ()=> {
        this.totalCount+=1;
    }

    increaseTotalTime = (currentTaskTime) => {
        this.totalTime += currentTaskTime;
    }

    printSummary = () =>{
        console.log("Total Count - "+ this.totalCount + " Total Time - "+ this.totalTime);
    }
};

