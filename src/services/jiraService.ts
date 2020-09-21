const axios = require('axios').default;
const constants = require('../config/constants');
const httpReq = axios.create({
    baseURL: constants.JIRA_DOMAIN + constants.JIRA_PROJECT_ISSUES,
    timeout: 5000,
    headers: {'Authorization': constants.AUTHORIZATION_TYPE + " " + constants.JIRA_API_TOKEN}
});

export const getProjectIssues = (projectId:string) => new Promise((resolve, reject) => {
    httpReq.get('/', {
        params: {
          jql: `project="${projectId}"`
        }
      })
      .then(function (response:any) {
        resolve(
            response.data.issues
        )
      })
      .catch(function (error:any) {
        let errorMsg:string = 'Problems from getting information from Jira, please retry later';
        let errorCode:number = 500;
        if (error.response && error.response.status == 400) {
          errorMsg = `There is no information from project: ${projectId}`
          errorCode = 404
        }
        reject({
          code: errorCode,
          message: errorMsg,
          status: errorCode
        })
      });
})