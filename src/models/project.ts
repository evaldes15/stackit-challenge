import { Issue } from './issue';

export interface Project{
    projectID:String;
    jiraIssues?:Issue[];
}