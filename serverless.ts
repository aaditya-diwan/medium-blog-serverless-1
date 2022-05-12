import type { AWS } from '@serverless/typescript';

import createTransaction from '@functions/createTransaction';
import getSummary from '@functions/getSummary';
import getRecords from '@functions/getRecords';
const serverlessConfiguration: AWS = {
  service: 'governance-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    READ_CAPACITY:1,
    WRITE_CAPACITY:1,
    TRANSACTION_TABLE:'gov-transaction',
    AWS_ACCOUNT_ID:'040022206507',
    AWS_DB_REGION:'ap-south-1',
  },
  plugins: ['serverless-webpack','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region:'ap-south-1',
    iamRoleStatements:[
      {
        'Effect': 'Allow',
        'Action': [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        'Resource': 'arn:aws:dynamodb:${self:custom.AWS_DB_REGION}:${self:custom.AWS_ACCOUNT_ID}:table/${self:custom.TRANSACTION_TABLE}'        
      },
      {
        "Effect": "Allow",
        "Action": "dynamodb:ListTables",
        "Resource": "*",
        "Condition": {}
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      stage:'${opt:stage}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions:
  { 
    createTransaction, 
    getSummary, 
    getRecords,
  },


};

module.exports = serverlessConfiguration;
