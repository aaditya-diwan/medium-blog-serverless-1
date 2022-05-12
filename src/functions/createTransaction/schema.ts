
export default {
  type: 'object',
  properties: {
    processingDate: {type:'string', format:'date'},
    startTime: {type:'number'},
    shift: {type:'string'},
    installerName: {type:'string', minLength :5},
    taskType: {type:'string', minLength:5},
    task: {type:'string',minLength :2},
    incidentNumber: {type:'number'},
    faxNumber: {type:'number'},
    sendersEmailId: {type:'string', format:'email'},
    comment: {type:'string'},
    overTimeCheck: {type:'boolean'},
  },
  required: ['processingDate', 'startTime', 'installerName', 'task', 'taskType']
} as const;