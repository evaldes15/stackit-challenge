const axios = require('axios').default;
const constants = require('../config/constants');
const jiraService = require('./jiraService')
const togglService = require('./togglService')
import { Project } from '../models/project';
import { Issue } from '../models/issue';
import { TimeEntry } from '../models/timeEntry';


const httpReq = axios.create({
    baseURL: constants.JIRA_DOMAIN + constants.JIRA_PROJECT_ISSUES,
    timeout: 5000,
    headers: {'Authorization': constants.AUTHORIZATION_TYPE + " " + constants.JIRA_API_TOKEN}
});

export const getProjectInformation = (projectId:string) => new Promise((resolve, reject) => {
    jiraService.getProjectIssues(projectId)
    .then((res:any) => {
        let issues = res;
        togglService.getTimeEntries(projectId)
        .then((res:any) => {
            resolve(mergeIssuesWithEntries(projectId,issues,res))
        })
        .catch((err:any) => {
            reject(err);
        });
    })
    .catch((err:any) => {
      reject(err);
    });
})

function mergeIssuesWithEntries(projectId:string,jiraIssues:any[],timeEntries:any[]){
    let projectData:Project = {projectID:projectId}
    let issues:Issue[] = [];
    jiraIssues.forEach(jiraIssue => {
        let categories = new Set<String>();
        let tags = new Set<String>();
        let togglEntriesData = getTimeEntriesByIssue(jiraIssue.key,timeEntries,categories,tags);
        let issue:Issue = { 
            id: jiraIssue.key,
            statusCategory:jiraIssue.fields.status.statusCategory.name,
            summary:jiraIssue.fields.issuetype.description,
            assignee:(jiraIssue.fields.assignee == null) ? "" : jiraIssue.fields.assignee.displayName,
            totalDuration: secondsToTimeFormat(togglEntriesData.totalDuration / 1000),
            totalDurationMillSeconds: togglEntriesData.totalDuration,
            aggregatedTags: Array.from(tags),
            aggregatedCategories: Array.from(categories),
            estimatedDuration: secondsToTimeFormat(jiraIssue.fields.timeestimate),
            estimatedDurationMillSeconds:jiraIssue.fields.timeestimate * 1000,
            togglEntries: togglEntriesData.timeEntries
        }
        issues.push(issue);
    });
    projectData.jiraIssues = issues;
    return projectData;
}

function getTimeEntriesByIssue(jiraIssue: string,togglTimeEntries:any[],categories:Set<String>,tags:Set<String>){
        let timeEntries:TimeEntry[] = [];
        let totalDuration:number = 0;
        togglTimeEntries.forEach(togglTimeEntry => {
            if(togglTimeEntry.description.replace(/\s/g, '').includes(jiraIssue)){
                let cat = constants.TAG_CATEGORIES_DICTIONARY.get(togglTimeEntry.tags[0]);
                timeEntries.push({
                    id:togglTimeEntry.id,
                    desc:togglTimeEntry.description,
                    start:timestampToTimeFormat(togglTimeEntry.start),
                    stop:timestampToTimeFormat(togglTimeEntry.end),
                    duration:secondsToTimeFormat(togglTimeEntry.dur/1000),
                    durationMillSeconds:togglTimeEntry.dur,
                    tags:togglTimeEntry.tags,
                    category: cat
                });
                totalDuration += togglTimeEntry.dur;
                togglTimeEntry.tags.forEach((t: String) => {
                    if(!tags.has(t))
                        tags.add(t)
                });
                if(!categories.has(cat))
                    categories.add(cat)
                
            }
        });
        return { timeEntries, totalDuration};
    }

    function timestampToTimeFormat(timestamp:string) : string {
        return timestamp.substring(timestamp.indexOf("T")+1,timestamp.lastIndexOf("-"));
    }


    function secondsToTimeFormat(timeSeconds:number) : string {
        let seconds, minutes, hours;
        hours = Math.floor(timeSeconds / 3600);
        minutes = Math.floor( ( timeSeconds - (hours * 3600) ) / 60 );
        seconds = timeSeconds - (hours * 3600) - ( minutes * 60 );
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${hours}:${minutes}:${seconds}`;
    }