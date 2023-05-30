import {signOut} from "next-auth/react";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import MyBookings from "@/pages/mybookings";

export default function Navbar({ selectedDate, selectedRole, setRows }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="nav">
			<h1 className='site-title'>Cyberjaya Toastmasters Agenda</h1>
			<ul
				className={`menu ${menuOpen ? "open" : ""}`}>
				<li>
					<MyBookings
						selectedDate={selectedDate}
						selectedRole={selectedRole}
						setRows={setRows}
					/>
				</li>
				<li>
					<h1
						className="pointer"
						onClick={() => signOut()}
					>
						Sign out
					</h1>
				</li>
			</ul>
		</nav>
	)
}
