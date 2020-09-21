import rewire = require("rewire");
const projectService = rewire('../src/services/projectService')
const jiraService = require('../src/services/jiraService')
const togglService = require('../src/services/togglService')
const constants = require('../src/config/constants');
const assert = require('assert')
let projectId:string = "PA";

describe("code challenge API test: ", function() {
	describe("project service: ", function() {
		it("Project service endpoint: happy pat", function() {
			this.timeout(5000);
			return projectService.getProjectInformation(projectId)
			.then((result:any)=>{
				assert.equal(result.projectID,projectId)
			});
		});
		it("Project service endpoint: error case", function() {
			return projectService.getProjectInformation("PW")
			.then((result:any)=>{}).catch ((error:any) =>{
				assert.equal(error.code,404)
			});
		});
		it("timestampToTimeFormat function", function() {
			let timeFormat:string = projectService.__get__("timestampToTimeFormat")("2020-06-25T23:00:00-05:00")
			assert.equal("23:00:00",timeFormat)
		});
		it("secondsToTimeFormat function", function() {
			let timeFormat:string = projectService.__get__("secondsToTimeFormat")(49200)
			assert.equal("13:40:00",timeFormat)
		});
	});
	describe("jira service: ", function() {
		it("jira service: happy pat", function() {
			this.timeout(2000);
			return jiraService.getProjectIssues(projectId)
			.then((result:any)=>{
				let data:any[] = result;
				assert(data.length > 0)
			});
		});
		it("jira service: error case", function() {
			this.timeout(2000);
			return jiraService.getProjectIssues("PW")
			.then((result:any)=>{}).catch ((error:any) =>{
				assert.equal(error.code,404)
			});
		});
		
	});
	describe("toggl service: ", function() {
		it("toggl service: happy pat", function() {
			this.timeout(2000);
			return togglService.getTimeEntries(projectId)
			.then((result:any)=>{
				let data:any[] = result;
				assert(data.length > 0)
			});
		});
		it("toggl service: error case invalid parameters", function() {
			constants.TOGGL_USER_AGENT = "";
			this.timeout(2000);
			return togglService.getTimeEntries(projectId)
			.then((result:any)=>{}).catch ((error:any) =>{
				assert.equal(error.code,400)
			});
		});		
		it("toggl service: error case invalid workspace", function() {
			constants.TOGGL_WORKSPACE = "342";
			constants.TOGGL_USER_AGENT = "api_test";
			this.timeout(2000);
			return togglService.getTimeEntries(projectId)
			.then((result:any)=>{}).catch ((error:any) =>{
				assert.equal(error.code,404)
			});
		});
	});		
});
