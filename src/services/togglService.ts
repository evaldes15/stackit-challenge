const axios = require('axios').default;
const constants = require('../config/constants');

const httpReq = axios.create({
    baseURL: constants.TOGGL_DOMAIN + constants.TOGGL_TIME_ENTRIES,
    timeout: 1000,
    headers: {'Authorization': constants.AUTHORIZATION_TYPE + " " + constants.TOGGL_API_TOKEN}
});

export const getTimeEntries = (projectId:string,pageIndex:number = 1,entriesCounter:number=0, data:object[] = []) => new Promise((resolve, reject) => {
    httpReq.get('/', {
        params: {
          workspace_id: constants.TOGGL_WORKSPACE,
          user_agent: constants.TOGGL_USER_AGENT,
          since: '2020-01-01',
          until: '2020-12-31',
          page: pageIndex
        }
      })
      .then(function (response:any) {
        let entries: number = entriesCounter + response.data.data.length;
        data.push(...response.data.data);
        if(entries < response.data.total_count)
          return resolve(getTimeEntries(projectId,++pageIndex,entries,data))
        else{
          return resolve(data)
      }   
      })
      .catch(function (error:any) {
        let errorMsg:string = 'Problems from getting information from Toggl, please retry later';
        let errorCode:number = 500;
        console.log(error.response)
        console.log(error.response.status)
        if (error.response && error.response.status == 400) {
          errorMsg = `Invalid parameters please verify`
          errorCode = 400
        }else if(error.response && error.response.status == 403){
          errorMsg = `Invalid workspace please verify`
          errorCode = 404
        }
        reject({
          code: errorCode,
          message: errorMsg,
          status: errorCode
        })
      });
})