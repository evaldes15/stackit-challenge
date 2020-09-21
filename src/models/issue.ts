import { TimeEntry } from './timeEntry';

export interface Issue{
    id:String;
    statusCategory:String;
    summary:String;
    assignee:String;
    totalDuration:String;
    totalDurationMillSeconds:number;
    aggregatedTags?:String[];
    aggregatedCategories?:String[];
    estimatedDuration:String;
    estimatedDurationMillSeconds:number;
    togglEntries?:TimeEntry[];
}