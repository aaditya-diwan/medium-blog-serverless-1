import 'source-map-support/register';

import {APIGatewayProxyHandler} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Summary } from '@data/class/Summary';
import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();
import { apiResponses } from '@libs/apiGateway';


const getTasksFromQueryResult = (summaryForUserName) => {
// code for creating taskArray goes here
let taskMain = [];
for(let i=0;i<summaryForUserName.Count;i++) {
  if(taskMain == null) {
    taskMain.push(summaryForUserName.Items[i].task);
  }
  else {
    if(!taskMain.includes(summaryForUserName.Items[i].task)) {
      taskMain.push(summaryForUserName.Items[i].task);
    }
  }
}
  return taskMain;
}

const createSummaryForIndividualTasks = (taskMain, summaryForUserName) =>{
  let summaryMain = [];
  for(let j=0;j<taskMain.length;j++) {
    let totalCount = 0;
    let id:number;
    let task:string;
    let taskType:string;
    let totalTime:number = 0;
    let uph:number;
    for(let k=0;k<summaryForUserName.Count;k++) {
      if(taskMain[j] == summaryForUserName.Items[k].task) {
        id = k;
        task = summaryForUserName.Items[k].task;
        taskType = summaryForUserName.Items[k].taskType;
        totalTime += summaryForUserName.Items[k].totalTime;
        totalCount += 1
      }
  }
  uph = (totalCount/totalTime)*8;
  summaryMain.push(new Summary(id, taskType, task, totalCount, totalTime, uph))
}
  return summaryMain;
}


// Returns the summary for each task for a particular user.\
const getSummary: APIGatewayProxyHandler = async (event) => {
  // Getting the required fields and converting date fields to milliseconds.
  const userName = event.pathParameters.userName;
  const startDate = event.pathParameters.startDate; //2021-05-09
  const endDate = event.pathParameters.endDate; // 2021 -06- 09
  const startDateInMillis = new Date(startDate).getTime();
  const endDateInMillis = new Date(endDate).getTime();

  const summaryParams = {
    TableName: process.env.TRANSACTION_TABLE,
    KeyConditionExpression: "installerName = :userName and sk_timeStamp between :startDate and :endDate",
    ExpressionAttributeValues:{
      ":userName" : userName,
      ":startDate": startDateInMillis,
      ":endDate" : endDateInMillis
    }
  }
  // Creates a QueryList taking in summaryParams
  const summaryForUserName = await
      dynamodb.query(summaryParams)
      .promise()

// code for creating summaryArray goes here
  let taskMain = getTasksFromQueryResult(summaryForUserName);
  let data = createSummaryForIndividualTasks(taskMain, summaryForUserName);

// returning a response to front-end
  if (summaryForUserName.Count === 0) {
    return apiResponses._500({error:"500[INTERNAL SERVER ERROR]"});   
  }
  else {
    return apiResponses._200({data});
  }
  
};

export const main = middyfy(getSummary);
