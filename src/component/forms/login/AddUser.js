import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './style.css';
import getDataFromToken from '../../../utils/jwtUtils/getDataFromToken';
import host from '../../../assest/host';
import Loader from '../../AccessDenied/Loader';
// import { autocompleteClasses } from "@mui/material";
import AdminHeader from '../../Admin/AdminHeader';
import '../../../App.css';
const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '150px',
		height: '55px',
		// backgroundColor: "#fa2d64",
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

const AddUser = () => {
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

	const [user, setUser] = useState({
		phoneNo: '',
		firstName: '',
		lastName: '',
		role: 'CONDUCTOR',
		password: '',
		matchingPassword: '',
		id: '',
	});
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');
	function Validate() {
		if (
			user.firstName === '' ||
			user.lastName === '' ||
			user.phoneNo.length !== 10 ||
			user.password === '' ||
			user.matchingPassword === ''
		) {
			setmessage('*Incorrect input/s*');
			setcolor('red');
			return false;
		} else if (user.password !== user.matchingPassword) {
			setmessage('*Password not matching*');
			setcolor('red');
			return false;
		} else if (user.password.length < 8) {
			setmessage('*Minimum length of password should be 8*');
			setcolor('red');
			return false;
		} else {
			setmessage('');
			setcolor('green');
			return true;
		}
	}
	const handlePhone = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				phoneNo: evt.target.value,
			};
		});
	};
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
	const handlePassword = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				password: evt.target.value,
			};
		});
	};
	const handleMatchingPassword = (evt) => {
		setUser((userData) => {
			return {
				...userData,
				matchingPassword: evt.target.value,
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
	const onSubmit = (event) => {
		event.preventDefault();
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');
		const data = {
			phoneNo: user.phoneNo,
			firstName: user.firstName,
			lastName: user.lastName,
			password: user.password,
			matchingPassword: user.matchingPassword,
			role: user.role,
			id: user.id,
		};
		if (data.role === 'CONDUCTOR' && data.id === '') {
			setmessage('Please enter conductor id.');
		}
		if (data.role !== 'CONDUCTOR') {
			data.id = '';
		}

		console.log(data);
		var config = {
			method: 'post',
			url: `${host.host}/register`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
			data: data,
		};

		if (Validate()) {
			setIsload(true);
			axios(config)
				.then(function (response) {
					console.log(JSON.stringify(response.data));
					setmessage('User Added Successfully');
					setcolor('green');
					setIsload(false);
					setUser((userData) => {
						return {
							...userData,
							phoneNo: '',
							firstName: '',
							lastName: '',
							password: '',
							matchingPassword: '',
							id: '',
						};
					});
				})
				.catch((err) => {
					setIsload(false);
					console.log(err);
					setmessage(err.response.data.message);
					setcolor('red');
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

					<div className="loginBoxqw">
						<h1
							style={{
								fontSize: '1.5em',
								fontWeight: 'bold',
								...classes.fontname,
							}}
						>
							Add User
						</h1>

						<form
							onSubmit={onSubmit}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%',
								height: '50%',
							}}
						>
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
									required
									floatingLabelText="First Name"
									value={user.firstName}
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
							<TextField
								id="outlined-basic"
								label="Phone"
								name="phone"
								required
								variant="outlined"
								type="number"
								value={user.phoneNo}
								onChange={handlePhone}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
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
							<TextField
								type="password"
								id="outlined-basic"
								label="Password"
								name="password"
								required
								variant="outlined"
								floatingLabelText="Password"
								value={user.password}
								onChange={handlePassword}
								// errorText={errors.password}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<TextField
								id="outlined-basic"
								type={'password'}
								name="confirmPassword"
								label="Confirm Password"
								required
								variant="outlined"
								floatingLabelText="Confirm Password"
								value={user.matchingPassword}
								onChange={handleMatchingPassword}
								// errorText={errors.organisation}
								style={{ width: '80%', ...classes.fontname }}
							/>
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

export default AddUser;
