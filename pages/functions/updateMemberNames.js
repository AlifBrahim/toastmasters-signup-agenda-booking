// In updateMemberNames.js
import { getMemberNames } from './getMemberNames';

export async function updateMemberNames(selectedDate, initialRows) {
    // Create a new rows array
    let newRows = initialRows.map((row) => {
        return {
            ...row,
            date: selectedDate, // Assign the selectedDate to each row
        };
    });

    // Call getMemberNames for each row in your table
    for (const row of newRows) {
        const memberNames = await getMemberNames(row.date, row.role);
        // Update the new rows array with the updated member names
        newRows = newRows.map((newRow) => {
            if (newRow.date === row.date && newRow.role === row.role) {
                return { ...newRow, member: memberNames[0] };
            }
            return newRow;
        });
    }

    return newRows;
}
