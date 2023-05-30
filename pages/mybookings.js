import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Styles from '../styles/Home.module.css';
import {updateMemberNames} from "@/pages/index";

export default function MyBookings({ selectedDate, selectedRole, setRows }) {
    const [open, setOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const { data: session } = useSession();

    const fetchBookings = async () => {
        if (session) {
            try {
                const res = await fetch(`/api/bookings?memberName=${session.user.name}`);
                const bookings = await res.json();
                if (Array.isArray(bookings)) {
                    // Convert the meetingDate property of each booking to a Date object
                    bookings.forEach((booking) => {
                        booking.meetingDate = new Date(booking.meetingDate);
                    });
                    // Sort the bookings array by meetingDate
                    bookings.sort((a, b) => a.meetingDate - b.meetingDate);
                    setBookings(bookings);
                } else {
                    console.error('Error: bookings is not an array:', bookings);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        }
    };


    // Add a handleDelete function to handle delete button clicks
    const handleDelete = async () => {
        try {
            // Send a DELETE request to the /api/bookings/[id] endpoint
            await fetch(`/api/bookings/${selectedBookingId}`, { method: 'DELETE' });
            // Refetch the bookings
            fetchBookings();
            // Reset the selectedBookingId and isDeleteMode state
            setSelectedBookingId(null);
            setIsDeleteMode(false);
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [session]);

    const handleClickOpen = () => {
        fetchBookings();
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setIsDeleteMode(false);
        setSelectedBookingId(null);
    };

    return (
        <>
            <h1 className='pointer' onClick={handleClickOpen}>
                My Bookings
            </h1>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle onClose={handleClose}>My Bookings</DialogTitle>
                <DialogContent dividers>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            onClick={() => {
                                if (isDeleteMode) {
                                    setSelectedBookingId(booking.id);
                                }
                            }}
                            style={{
                                backgroundColor:
                                    isDeleteMode && booking.id === selectedBookingId ? 'lightblue' : 'inherit',
                                cursor: isDeleteMode ? 'pointer' : 'default',
                            }}
                        >
                            <Typography gutterBottom>
                                {booking.meetingDate.toLocaleDateString('en-MY', {
                                    timeZone: 'Asia/Kuala_Lumpur',
                                })}{' '}
                                - {booking.roles}
                            </Typography>
                        </div>
                    ))}

                </DialogContent>
                <DialogActions>
                    {isDeleteMode && (
                        <>
                            <Button autoFocus onClick={() => setIsDeleteMode(false)}>
                                Cancel
                            </Button>
                            <Button autoFocus onClick={handleDelete}>
                                Confirm
                            </Button>
                        </>
                    )}
                    {!isDeleteMode && (
                        <>
                            <Button autoFocus onClick={() => setIsDeleteMode(true)}>
                                Delete
                            </Button>
                            <Button autoFocus onClick={handleClose}>
                                Close
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

