// In fetchCalendarData.js
const apiKey = process.env.MY_API_KEY;

export async function fetchCalendarData() {
    var dateNow = new Date().toISOString();
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/p75em956e3b5r49tdpivg9ag2c%40group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin=${dateNow}&key=${apiKey}`);
    const repo = await res.json();
    const dates = repo.items.map(item => item.start.dateTime.slice(0, 10));
    return dates;
}
