import express = require('express');
const app: express.Application = express();
const projectService = require('./services/projectService')

app.get('/', function (req:any, response:any) {
    projectService.getProjectInformation(req.query.projectId)
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