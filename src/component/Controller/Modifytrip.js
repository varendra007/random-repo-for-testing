import * as React from 'react';
import './Controller.css';
import TextField from '@mui/material/TextField';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
import AdminHeader from '../Admin/AdminHeader';
import '../../App.css';
import Loader from '../AccessDenied/Loader';
import { InputLabel } from '@mui/material';
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

const ModifyTrip = () => {
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [phoneNo, setPhoneNo] = React.useState(
		new URL(window.location.href).searchParams.get('phoneNo')
	);
	const [busNo, setBusNo] = React.useState(
		new URL(window.location.href).searchParams.get('busNo')
	);
	const [time, setTime] = React.useState(
		new URL(window.location.href).searchParams.get('time')
	);
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');
	const [isload, setIsload] = React.useState(false);
	const [passanger, setPassanger] = React.useState('');
	function Validate() {
		// var regex = /^KA-\d{2}-[A-Z]{1,2}-\d{4}$/;
		if (phoneNo.length !== 10 || busNo === '' || time === '') {
			setmessage('*Incorrect input/s*');
			setcolor('red');
			return false;
		}
		// else if (!regex.test(busNo)) {
		// 	setmessage('*Incorrect Bus number format*');
		// 	setcolor('red');
		// 	return false;
		// }
		else {
			setmessage('');
			setcolor('green');
			return true;
		}
	}
	// console.log(new Date(new URL(window.location.href).searchParams.get('time')));
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
			} else if (user.role === 'CONTROLLER') {
				setHomeUrl('/controller');
				setIsRoutePermitted(true);
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
			var tt = new URL(window.location.href).searchParams.get('tripId');
			if (tt === null || tt === '') {
				window.location.href = '/view-trip';
			}
		}
	}, [isRoutePermitted]);
	const onSubmit = (event) => {
		event.preventDefault();
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');
		var passangerNos = [];
		if (passanger) {
			var x = passanger.split(',');
			for (var i = 0; i < x.length; i++) {
				passangerNos.push(x[i].trim());
			}
		}
		const data = {
			conductorNo: phoneNo,
			busNo,
			timeOfDepatarture: new Date(time),
			passengerNos: passangerNos,
		};
		var tid = new URL(window.location.href).searchParams.get('tripId');
		var config1 = {
			method: 'delete',
			url: `${host.host}/trip/${tid}`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
		};
		if (tid === null || tid === '') {
			return;
		}
		if (Validate()) {
			setIsload(true);
			axios(config1)
				.then((res) => {
					if (res.status === 200) {
						console.log(data);
						setmessage(res.data.message);
						setcolor('green');
						var config = {
							method: 'post',
							url: `${host.host}/trip`,
							headers: {
								Authorization: `Bearer ${window.localStorage.getItem(
									'jwtToken'
								)}`,
							},
							data: data,
						};

						axios(config)
							.then(function (response) {
								console.log(JSON.stringify(response.data));
								setmessage(res.data.message);
								setcolor('green');
								if (response.status === 200) {
									setTimeout(() => {
										window.history.go(-1);
									}, 1000);
								}
								setIsload(false);
							})
							.catch((err) => {
								setIsload(false);
								console.log(err);
								setmessage(err.response.data.message);
								if (err.response.data.status === 500) {
									setmessage('*No conductor exits with current phone number*');
								}
								setcolor('red');
							});
					}
				})
				.catch((err) => {
					setIsload(false);
					console.log(err);
					setmessage(err.response.data.message);
					if (err.response.data.status === 500) {
						setmessage('*No conductor exits with current phone number*');
					}
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
					{/* <div className="navbarx">
				<a href={`${homeUrl}`}>Home</a>
				<div className="dropdownx">
					<button className="dropbtnx">Profile</button>
					<div className="dropdown-contentx">
						<a href="/view-profile">View Profile</a>
						<a href="/change-password">Change Password</a>
						<a
							href="/"
							onClick={() => {
								window.localStorage.removeItem('jwtToken');
								window.location = '/';
							}}
						>
							Logout
						</a>
					</div>
				</div>
			</div> */}
					{/* <h1
				style={{
					fontSize: '1.5em',
					fontWeight: 'bold',
					textAlign: 'center',
					paddingTop: '1%',
					fontFamily: 'inherit',
					...classes.fontname,
				}}
			>
				North Western Karnataka Road Transport Corporation
			</h1> */}
					<div className="loginBoxx">
						<h1
							style={{
								fontSize: '1.5em',
								fontWeight: 'bold',
								...classes.fontname,
							}}
						>
							Modify Trip
						</h1>
						<form
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								width: '100%',
								...classes.fontname,
							}}
							onSubmit={onSubmit}
						>
							<TextField
								id="outlined-basic"
								label="Conductor Phone"
								name="phone"
								variant="outlined"
								type="number"
								required
								value={phoneNo}
								onChange={(evt) => {
									setPhoneNo(evt.target.value);
								}}
								// value={user.email}
								// onChange={onChange}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>

							{/* <br />
					<TextField
						type="Time"
						id="outlined-basic"
						label="Time of Diparture"
						name="Time"
						variant="outlined"
						floatingLabelText="Password"
						// value={user.password}
						// onChange={onPwChange}
						// errorText={errors.password}
						style={{ width: '80%', ...classes.fontname }}
					/> */}
							<br />
							<TextField
								type="text"
								id="outlined-basic"
								label="Bus no"
								placeholder="eg:F9780"
								name="busNo"
								variant="outlined"
								required
								value={busNo}
								onChange={(evt) => {
									setBusNo(evt.target.value);
								}}
								// value={user.pwconfirm}
								// onChange={onChange}
								// errorText={errors.pwconfirm}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<TextField
								// required
								label="Passangers"
								// name="Date"
								variant="outlined"
								type="text"
								value={passanger}
								onChange={(evt) => {
									setPassanger(evt.target.value);
								}}
								placeholder={'Enter comma seperated passenger numbers'}
								// value={user.email}
								// onChange={onChange}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<InputLabel id="date-time">Date and Time of departure</InputLabel>
							<TextField
								id="outlined-basic"
								required
								// label="Date"
								// name="Date"
								variant="outlined"
								type="datetime-local"
								value={time}
								onChange={(evt) => {
									console.log(evt.target.value);
									setTime(evt.target.value);
								}}
								// value={user.email}
								// onChange={onChange}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<button style={classes.button} className="defaultButtonHover1">
								Modify Trip
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

export default ModifyTrip;
