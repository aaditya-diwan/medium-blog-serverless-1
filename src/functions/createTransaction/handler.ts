import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
const dynamodb = new AWS.DynamoDB.DocumentClient();


const createTransaction: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id:string = uuid();
  const body = event.body;
  const timeStamp:number = new Date().getTime();
  const totalTimeForTask:number = (timeStamp - body.startTime)/600000;
  const params = {
    TableName: process.env.TRANSACTION_TABLE,
    Item:{
        id:id,
        processingDate:body.processingDate,
        startTime:body.startTime,
        shift : body.shift,
        installerName: body.installerName,
        taskType:body.taskType,
        task:body.task,
        incidentNumber:body.incidentNumber,
        faxNumber:body.faxNumber,
        sendersEmailId:body.sendersEmailId,
        comment:body.comment,   
        overTimeCheck:body.overTimeCheck,
        sk_timeStamp:timeStamp,
        totalTime:totalTimeForTask
    }    
  }
  await dynamodb
        .put(params)
        .promise();

  return formatJSONResponse(
    {
      message: `inserted new item successfully!`
    },
  );
};

export const main = middyfy(createTransaction);
