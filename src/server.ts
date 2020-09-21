import express = require('express');
const app: express.Application = express();
const projectService = require('./services/projectService')

app.get('/', function (req:any, response:any) {
    if(req.query.projectId == undefined && req.query.projectKey == undefined){
        return response.status(400).send({
            status: 400,
            result: "Missing required parameter: projectId or projectKey"
        });
    }
    let projectId:string = (req.query.projectId == undefined) ? req.query.projectKey : req.query.projectId ;
    projectService.getProjectInformation(projectId)
    .then((res:any) => {
        response.send(res);
    })
    .catch((err:any) => {
        if(err.status){
            let status:number = err.status;
            delete err.status;
            response.status(status).send(err);
        }else
            response.status(500).send(err);
    });
});

app.listen(80, function () {
    console.log('App is listening on port 80!');
});