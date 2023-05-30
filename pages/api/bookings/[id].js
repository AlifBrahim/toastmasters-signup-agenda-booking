// In pages/api/bookings/[id].js
import db from '../../../lib/db';

export default async (req, res) => {
    if (req.method === 'DELETE') {
        // Get the booking id from the request query
        const { id } = req.query;

        // Define the SQL query to delete the booking with the specified id
        const sql = 'DELETE FROM cctmcagenda WHERE id = ?';
        const values = [id];

        try {
            // Execute the SQL query
            await db.query(sql, values);
            // Send a success response
            res.status(204).end();
        } catch (error) {
            // Handle error
            console.error('An error occurred while deleting the booking:', error);
            res.status(500).send('An error occurred while deleting the booking');
        }
    } else {
        // Handle other request methods
        res.status(405).send('Method not allowed');
    }
};
