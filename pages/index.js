import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Head from 'next/head';
import homeStyles from '../styles/Home.module.css';
import { useSession} from 'next-auth/react';
import Navbar from '../components/Nav';
import Footer from '@/components/footer';
import Loader from '@/components/loader';


const apiKey = process.env.MY_API_KEY;
export const getServerSideProps = async () => {
    var dateNow = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/p75em956e3b5r49tdpivg9ag2c%40group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin=${dateNow}&key=${apiKey}`
    const res = await fetch(url);
    const repo = await res.json();
    const dates = repo.items.map(item => item.start.dateTime.slice(0, 10));
    // repo.items.forEach(item => {
    //     console.log(item.start.dateTime);
    // });
    return { props: { dates } };
};
async function getMemberNames(meetingDate, role) {
    const res = await fetch(`/api/getMemberNames?meetingDate=${meetingDate}&role=${role}`);
    const data = await res.json();
    return data;
}

const initialRows = [
    { role: 'Toastmaster of the Day', member: null },
    { role: 'Table Topics Master', member: null },
    { role: 'Speaker 1', member: null },
    { role: 'Speaker 2', member: null },
    { role: 'Speaker 3', member: null },
    { role: 'Speaker 4', member: null },
    { role: 'Table Topics Evaluator', member: null },
    { role: 'Evaluator 1', member: null },
    { role: 'Evaluator 2', member: null },
    { role: 'Evaluator 3', member: null },
    { role: 'Evaluator 4', member: null },
    { role: 'General Evaluator', member: null },
    { role: 'Grammarian', member: null },
    { role: 'Ah Counter', member: null },
    { role: 'Timer', member: null },
];
export async function updateMemberNames(selectedDate, selectedRole, setRows) {
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
    // Update your component's state with the new rows
    setRows(newRows);
}

export default function BasicTable({dates}) {
    const [selectedDate, setSelectedDate] = useState(dates[0]);
    const [selectedRole, setSelectedRole] = useState('Toastmaster of the Day');
    const [bookedMember, setBookedMember] = useState(null);
    const [isBookingMode, setBookingMode] = useState(false);
    const [rows, setRows] = useState(initialRows);
    const { data: session, status } = useSession();

    useEffect(() => {
        updateMemberNames(selectedDate, selectedRole, setRows);
    }, [selectedDate, selectedRole]);

    if (status === "loading") {
        return <Loader />;
    }

    if (!session) {
        if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
        }
        return null;
    }


    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setSelectedRole('');
        setBookedMember(null);
        setBookingMode(false);
    };


    const handleRoleClick = (role) => {
        if (isBookingMode) {
            const selectedRow = rows.find((row) => row.role === role);
            if (selectedRow.member) {
                alert("This role has already been booked.");
            } else {
                setSelectedRole(role);
            }
        }
        else {
            setSelectedRole(role);
        }
        // if (selectedRole === role) {
        //     setSelectedRole('');
        // } else {
        //     setSelectedRole(role);
        // }
    };



    const handleBookClick = () => {
        setBookingMode(true);
        const rowIndex = rows.findIndex(row => row.role === selectedRole);
        // Check if rowIndex is not -1

    };


    const handleCancelClick = () => {
        setSelectedRole('');
        setBookingMode(false);
    };
    const handleConfirmClick = () => {
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
    };





    const handleDeleteClick = async () => {
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
                await updateMemberNames();
            } else {
                // Display an error message
                alert("You can only delete your own booking.");
            }
        } else {
            // Display an error message
            alert("Please select the role.");
        }
    };






    return (
        <>
            <Navbar
                selectedDate={selectedDate}
                selectedRole={selectedRole}
                setRows={setRows}
            />
            <Head>
                <title>Agenda</title>
                <h1 className={homeStyles['agenda-title']}>Agenda</h1>
            </Head>
            <br></br>

            <div
                style={{ maxWidth: '100%', overflowX: 'auto', padding: '0 16px' }}
            >
                <label className="choose-meeting" htmlFor="date-select">Choose a meeting: </label>

                <select
                    id="date-select"
                    value={selectedDate}
                    onClick={handleDateChange}
                    onChange={handleDateChange}
                    style={{ marginRight: '16px' }}
                >
                    {dates.map((date) => (
                        <option key={date} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <br></br>
                <br></br>
                <TableContainer component={Paper} sx={{ margin: '0 auto' }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow align="left">
                                <TableCell>Roles</TableCell>
                                <TableCell  align="left" component="th" scope="row" >Member</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.role}
                                    onClick={() => handleRoleClick(row.role)}
                                    style={{
                                        backgroundColor:
                                            row.role === selectedRole ? '#F2DF74' : 'inherit',
                                        cursor: isBookingMode ? 'pointer' : 'default',
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.role}
                                    </TableCell>
                                    <TableCell>
                                        <span>{row.member}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <br />
                <div style={{ textAlign: 'right' }}>
                    {!isBookingMode && (
                        <>
                            <button
                                onClick={handleBookClick}
                                style={{ fontSize: '1.2rem', marginLeft: 'auto', marginRight: '1rem' }}
                            >
                                Book
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                style={{ fontSize: '1.2rem', marginLeft: 'auto', marginRight: '1rem' }}
                            >
                                Delete
                            </button>

                        </>
                    )}
                    {isBookingMode && (
                        <>
                            <button
                                onClick={handleCancelClick}
                                style={{ fontSize: '1.2rem', marginLeft: 'auto', marginRight: '1rem' }}
                            >Cancel
                            </button>
                            {selectedRole && (
                                <button
                                    onClick={handleConfirmClick}
                                    style={{ fontSize: '1.2rem', marginLeft: 'auto', marginRight: '1rem' }}
                                >Confirm
                                </button>
                            )}
                            <span className='span'>Click on a role to book</span>
                        </>
                    )}
                </div>
            </div>
            <br></br>
            <Footer />
        </>
    );
}