// pages/api/bookings.js
import db from '../../lib/db';

export default async function handler(req, res) {

    try {
        const { memberName } = req.query;
        const sql = 'SELECT * FROM cctmcagenda WHERE memberName = ?';

        const [rows] = await db.execute(sql, [memberName]);
        res.status(200).json(rows.map((row) => ({ meetingDate: row.meetingDate, roles: row.roles, id: row.id })));

        // Bing gave me this code, but it doesn't work, ended up using the code above after hours of trying to get this to work
        // await db.query(sql, [memberName], (error, results) => {
        //     if (error) {
        //         throw new Error('Error retrieving bookings from database');
        //     } else {
        //         res.status(200).json(results);
        //         console.log("results: " + results)
        //         console.log("memberName: " + memberName)
        //     }
        // });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
