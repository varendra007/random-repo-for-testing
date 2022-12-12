import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './style.css';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
import AdminHeader from './AdminHeader';
import Loader from '../AccessDenied/Loader';
import '../../App.css';
const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '150px',
		height: '55px',
		// backgroundColor: '#fa2d64',
		color: '#ffffff',
		fontStyle: 'normal',
		fontFamily: 'Inter',
		fontWeight: '600',
		textAlign: 'center',
		fontSize: '26px',
		cursor: 'pointer',
	},
	fontname: {
		fontFamily: 'Inter',
	},
};

const ModifyUser = () => {
	const [user, setUser] = useState({
		firstName: `${new URL(window.location.href).searchParams.get('firstName')}`,
		lastName: `${new URL(window.location.href).searchParams.get('lastName')}`,
		role: `${new URL(window.location.href).searchParams.get('role')}`,
		phoneNo: `${new URL(window.location.href).searchParams.get('phoneNo')}`,
		id: `${new URL(window.location.href).searchParams.get('id') || ''}`,
	});
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');

	// !Protecting routes
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [isload, setIsload] = React.useState(false);

	React.useEffect(() => {
		var user;
		if (window.localStorage.getItem('jwtToken')) {
			user = getDataFromToken(window.localStorage.getItem('jwtToken'));
			if (user.isExp) {
				localStorage.removeItem('jwtToken');
				window.location = '/';
			} else if (user.role === 'ADMIN') {
				setIsRoutePermitted(true);
				setHomeUrl('/admin');
			} else {
				setIsRoutePermitted(false);
				window.location.href = '/access-denied';
			}
		} else {
			localStorage.removeItem('jwtToken');
			window.location = '/';
		}
	}, []);

	React.useEffect(() => {
		if (isRoutePermitted) {
			var phn = new URL(window.location.href).searchParams.get('phoneNo');
			if (phn === null || phn === '') {
				window.location.href = '/view-users';
			}
		}
	}, [isRoutePermitted]);

	const handleFirstName = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				firstName: evt.target.value,
			};
		});
	};
	const handleLastName = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				lastName: evt.target.value,
			};
		});
	};

	const handleRole = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				role: evt.target.value,
			};
		});
	};
	function Validate() {
		if (user.firstName === '' || user.lastName === '' || user.phoneNo === '') {
			setmessage('*Incorrect input/s*');
			setcolor('red');
			return false;
		} else {
			setmessage('');
			setcolor('green');
			return true;
		}
	}
	const onSubmit = (event) => {
		event.preventDefault();
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');
		const data = {
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			phoneNo: user.phoneNo,
			id: user.id,
		};
		if (data.role === 'CONDUCTOR' && !data.id) {
			setmessage('Please enter conductor id.');
			setcolor('red');
		}
		if (data.role !== 'CONDUCTOR') {
			data.id = '';
		}
		console.log(data);
		if (Validate()) {
			setIsload(true);
			var config = {
				method: 'post',
				url: `${host.host}/modify`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
				},
				data: data,
			};

			axios(config)
				.then(function (response) {
					console.log(JSON.stringify(response.data));
					setcolor('green');
					setmessage('Modified data successFully');
					setIsload(false);
				})
				.catch((err) => {
					console.log(err.response.data.message);
					setcolor('red');
					setmessage(err.response.data.message);
					setIsload(false);
				});
		}
		// client server logic to sign in
	};

	return (
		<div>
			{isload ? (
				<Loader />
			) : (
				<div>
					<AdminHeader homeUrl={homeUrl} />

					<div className="loginBox">
						<h1 className={classes.fontname}>Modify User</h1>

						<form
							onSubmit={onSubmit}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%',
								...classes.fontname,
							}}
						>
							<input
								type="number"
								id="outlined-basic"
								label="Phone"
								name="phoneNo"
								variant="outlined"
								floatingLabelText="Phone"
								value={user.phoneNo}
								// onChange={handlePhone}
								readOnly
								contentEditable={false}
								// errorText={errors.password}
								style={{
									width: '80%',
									...classes.fontname,
									height: '5vh',
									textAlign: 'center',
									fontSize: '20px',
									letterSpacing: '3px',
								}}
							/>
							<br />
							<div
								style={{
									display: 'flex',
									margin: '0',
									width: '80%',
									justifyContent: 'space-between',
								}}
							>
								<TextField
									id="outlined-basic"
									label="First Name"
									name="firstName"
									variant="outlined"
									floatingLabelText="First Name"
									value={user.firstName}
									required
									onChange={handleFirstName}
									// errorText={errors.username}
									style={{ ...classes.fontname, width: '45%' }}
								/>
								<TextField
									id="outlined-basic"
									label="Last Name"
									name="lastName"
									required
									variant="outlined"
									floatingLabelText="Last Name"
									value={user.lastName}
									onChange={handleLastName}
									// errorText={errors.username}
									style={{ ...classes.fontname, width: '45%' }}
								/>
							</div>

							<br />
							{/* <select
					id="outlined-basic"
					label="Role"
					name="role"
					variant="outlined"
					value={user.role}
					onChange={handleRole}
					style={{ width: '80%', ...classes.fontname, height: '10%' }}
				>
					<option value="CONDUCTOR">Conductor</option>
					<option value="CONTROLLER">Traffic Controller</option>
					<option value="ADMIN">Admin</option>
				</select> */}
							<select
								style={{
									width: '80%',
									height: '8vh',
									fontFamily: 'Inter',
									fontSize: '1.25em',
								}}
								id="outlined-basic"
								label="Role"
								name="role"
								variant="outlined"
								value={user.role}
								onChange={handleRole}
							>
								<option value="CONDUCTOR">&nbsp;Conductor</option>
								<option value="CONTROLLER">&nbsp;Traffic Controller</option>
								<option value="ADMIN">&nbsp;Admin</option>
							</select>
							{user.role === 'CONDUCTOR' && (
								<>
									<br />
									<TextField
										label="Conductor ID"
										required
										variant="outlined"
										type="text"
										value={user.id}
										onChange={(evt) => {
											setUser((prev) => {
												return { ...prev, id: evt.target.value };
											});
										}}
										// errorText={errors.email}
										style={{ width: '80%', ...classes.fontname }}
									/>
								</>
							)}
							<br />

							<button style={classes.button} className="defaultButtonHover1">
								Submit
							</button>
							<div
								style={{
									color: colorx,
									fontSize: '1em',
									padding: '1%',
									textAlign: 'center',
									fontFamily: 'monospace',
								}}
							>
								{message}
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ModifyUser;
