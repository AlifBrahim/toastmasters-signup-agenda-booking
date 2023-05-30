// In pages/api/deleteBooking.js
const db = require('../../lib/db');

export default (req, res) => {
    if (req.method === 'POST') {
        const { meetingDate, role, memberName } = req.body;

        const sql = 'DELETE FROM cctmcagenda WHERE meetingDate = ? AND roles = ? AND memberName = ?';
        const values = [meetingDate, role, memberName];

        console.log('Executing SQL query:', sql);
        console.log('With values:', values);

        // Update your database with the provided information
        // The exact implementation will depend on your specific database structure and setup
        db.query(sql, values, (error, results) => {
            if (error) {
                // Handle error
                console.error('An error occurred while updating the database:', error);
                res.status(500).send('An error occurred while updating the database');
            } else {
                // Send success response
                console.log('Booking deleted successfully:', results);
                res.send('Booking deleted successfully');
            }
        });
    } else {
        // Handle other request methods
        res.status(405).send('Method not allowed');
    }
};
