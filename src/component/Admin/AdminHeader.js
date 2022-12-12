import React, { useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import './Admin.css';
const AdminHeader = ({ homeUrl }) => {
	const matches = useMediaQuery('(max-width:950px)');

	return (
		<>
			<div
				className="navbarx"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					background: '#198bd2',
					width: '100vw',
					minHeight: '8vh',
					alignItems: 'center',
				}}
			>
				<div>
					<a href={`${homeUrl}`} style={{ textDecoration: 'underline' }}>
						Home
					</a>
					<div className="dropdownx">
						<button
							className="dropbtnx"
							style={{ textDecoration: 'underline' }}
						>
							Profile
						</button>
						<div className="dropdown-contentx">
							<a href="/view-profile">View Profile</a>
							<a href="/change-password">Change Password</a>
							<a href="/forgot-password">Forgot Password</a>
						</div>
					</div>
				</div>
				<h1
					style={{
						fontSize: '1.5em',
						fontWeight: 'bold',
						textAlign: 'center',
						paddingTop: '0',
						fontFamily: 'inherit',
						margin: '0',
						color: 'white',
					}}
				>
					{matches ? (
						<>NWKRTC</>
					) : (
						<>North Western Karnataka Road Transport Corporation</>
					)}
				</h1>
				<a
					href="/"
					onClick={() => {
						localStorage.removeItem('jwtToken');
						window.location = '/';
					}}
					style={{
						textDecoration: 'underline',
					}}
				>
					Logout
				</a>
			</div>
			<br></br>
			<br></br>
		</>
	);
};

export default AdminHeader;
