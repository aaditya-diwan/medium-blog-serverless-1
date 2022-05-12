#! /bin/bash

npm install -g serverless
npm install
npm install -g typescript
npm install -g ts-node
serverless deploy --stage $env \   $CODEBUILD_SRC_DIR/target/$env -v -r ap-south-1