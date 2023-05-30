const mysql = require('mysql');
const fetch = require('node-fetch');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'alif1234',
    database: 'tysql'
});

connection.connect();

async function populateMeetingDates() {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/p75em956e3b5r49tdpivg9ag2c%40group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin=2023-05-28T08:41:52.759Z&key=AIzaSyDZ5nJ17oqEUSI2fw7AXohYB5rHlKAzfYU');
    const repo = await res.json();
    const dates = repo.items.map(item => item.start.dateTime.slice(0, 10));

    dates.forEach(date => {
        connection.query('INSERT INTO cctmcagenda (meetingDate) VALUES (?)', [date], (error, results, fields) => {
            if (error) throw error;
            console.log(`Inserted ${results.affectedRows} row(s)`);
        });
    });
    console.log('Done');
}
populateMeetingDates().then(r => console.log(r));
module.exports = { populateMeetingDates };
