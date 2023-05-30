import db from '../../lib/db';
export default async function handler(req, res) {
    const { meetingDate, role } = req.query;
    const [rows] = await db.execute(
        'SELECT memberName FROM cctmcagenda WHERE meetingDate = ? AND roles = ?',
        [meetingDate, role]
    );
    console.log(rows);
    res.status(200).json(rows.map(row => row.memberName));
    console.log("Meeting Date: " + meetingDate);
}
