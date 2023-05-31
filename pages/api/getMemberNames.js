import db from '../../lib/db';

export default async function handler(req, res) {
    try {
        const { meetingDate, role } = req.query;
        const [rows] = await db.execute(
            'SELECT memberName FROM cctmcagenda WHERE meetingDate = ? AND roles = ?',
            [meetingDate, role]
        );
        res.status(200).json(rows.map(row => row.memberName));
    } catch (error) {
        if (error.code === 'ETIMEDOUT') {
            // handle the ETIMEDOUT error
            console.error('A timeout error occurred:', error.message);
            res.status(500).json({ error: 'A timeout error occurred' });
        } else {
            // handle other errors
            console.error('An error occurred:', error.message);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
}
