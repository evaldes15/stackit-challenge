const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'toor',
    database: 'toggl_db'
});

export const saveEntries = (togglTimeEntries:any[]) => {
    var sqlQuery = "INSERT INTO toggl_entries (id, description, start, end, dur, tags) VALUES ?";
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err:any, connection:any) {
                let entries:any[] = []
                togglTimeEntries.forEach(togglTimeEntry => {
                    let entry:any[] = [];
                    entry.push(togglTimeEntry.id)
                    entry.push(togglTimeEntry.description)
                    entry.push(togglTimeEntry.start)
                    entry.push(togglTimeEntry.end)
                    entry.push(togglTimeEntry.dur)
                    entry.push(togglTimeEntry.tags.toString())
                    entries.push(entry)
                });
                pool.query(sqlQuery, [entries], (err:any) => {
                    if(err) 
                        reject(err);
                    resolve('Data inserted on DB');
                });
        });
    });
}

export const getEntries = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM toggl_entries', (err:any,rows:any) => {
            if(err) 
             reject(err);
            console.log('Data received from Db:');
            reject(rows);
        });
    });
}