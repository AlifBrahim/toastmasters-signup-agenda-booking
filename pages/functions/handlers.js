// In handlers.js
export function handleDateChange(event, setSelectedDate) {
    console.log('Selected date:', event.target.value);
    setSelectedDate(event.target.value);
}

export function handleRoleClick(role, isBookingMode, setSelectedRole) {
    if (isBookingMode) {
        const selectedRow = rows.find((row) => row.role === role);
        if (selectedRow.member) {
            alert("This role has already been booked.");
        } else {
            setSelectedRole(role);
        }
    } else {
        setSelectedRole(role);
    }
}

export function handleBookClick(setBookingMode) {
    setBookingMode(true);
}

export function handleCancelClick(setSelectedRole, setBookingMode) {
    setSelectedRole('');
    setBookingMode(false);
}

export function handleConfirmClick(
    selectedRole,
    rows,
    session,
    setRows,
    setBookedMember,
    setBookingMode,
    fetchBookings
) {
    const selectedRow = rows.find((row) => row.role === selectedRole);
    if (selectedRow.member) {
        alert("This role has already been booked.");
    } else {
        // Perform the booking process and send the request to the server
        // ...
        const rowIndex = rows.findIndex(row => row.role === selectedRole);
        // Update the member property of the row with the chosen role
        rows[rowIndex].member = session.user.name;
        // insert the name in the row
        setBookedMember(session.user.name);
        setBookingMode(false);
        // Send request to server with selectedDate, selectedRole and user's name information
        fetch('/api/bookRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meetingDate: selectedDate,
                roles: selectedRole,
                memberName: session.user.name
            })
        });
    }
}

export async function handleDeleteClick(
    selectedRole,
    rows,
    session,
    setRows,
    setBookingMode,
    fetchBookings
) {
    // Find the index of the row with the chosen role
    const rowIndex = rows.findIndex(row => row.role === selectedRole);
    // Check if rowIndex is not -1
    if (rowIndex !== -1) {
        // Check if the member property of the row with the chosen role is equal to the current user's name
        if (rows[rowIndex].member === session.user.name) {
            // Update the member property of the row with the chosen role
            rows[rowIndex].member = null;
            setBookingMode(false);

            // Send request to server to delete user's booking from database
            await fetch('/api/deleteBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meetingDate: selectedDate,
                    role: selectedRole,
                    memberName: session.user.name
                })
            });

            // Refresh table data
            await fetchBookings();
        } else {
            // Display an error message
            alert("You can only delete your own booking.");
        }
    } else {
        // Display an error message
        alert("Could not find a row with the chosen role.");
    }
}
