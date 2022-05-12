import 'source-map-support/register';

import {APIGatewayProxyHandler} from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getRecords: APIGatewayProxyHandler = async (event) => {
  const userName = event.pathParameters.userName;
  const startDate = event.pathParameters.startDate;
  const endDate = event.pathParameters.endDate;
  const startDateInMillis = new Date(startDate).getTime();
  const endDateInMillis = new Date(endDate).getTime();
  
  const params = {
    TableName: process.env.TRANSACTION_TABLE,
    KeyConditionExpression: "installerName = :userName and sk_timeStamp between :startDate and :endDate",
    ExpressionAttributeValues:{
      ":userName" : userName,
      ":startDate": startDateInMillis,
      ":endDate" : endDateInMillis
    }
  }
  
  const userRecords = await
      dynamodb.query(params)
      .promise()


  if (userRecords.Count === 0) {
    return formatJSONResponse(
      {
        error:"Summary Does no exist",
      },
      404
    );    
  }
  else {
    return formatJSONResponse(
      {
        records:userRecords,
      },
    );
  }
  
};

export const main = middyfy(getRecords);