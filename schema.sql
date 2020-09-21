create database toggl_db;
use toggl_db;
create table toggl_entries (
    id INT(11) NOT NULL PRIMARY KEY,
    description VARCHAR(300),
    start VARCHAR(200),
    end VARCHAR(200),
    dur INT(12),
    tags VARCHAR(300)
);