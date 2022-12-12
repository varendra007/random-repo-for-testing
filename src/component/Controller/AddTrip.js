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
const getCrctTime = (time) => {
	var t = new Date(time);
	// t.setTime(t.getTime() - 5.5 * 60 * 60 * 1000);
	return t;
};
const AddTrip = () => {
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [phoneNo, setPhoneNo] = React.useState('');
	const [busNo, setBusNo] = React.useState('');
	const [time, setTime] = React.useState('');
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');
	const [isload, setIsload] = React.useState(false);
	const [passanger, setPassanger] = React.useState(null);
	function Validate() {
		// var regex = /^KA-\d{2}-[A-Z]{1,2}-\d{4}$/;
		if (phoneNo.length != 10 || busNo == '' || time == '') {
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

	function addtrip() {
		var axios = require('axios');
		console.log(time);
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
			timeOfDepatarture: getCrctTime(time),
			passengerNos: passangerNos,
		};

		console.log(data);
		var config = {
			method: 'post',
			url: `${host.host}/trip`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
			data: data,
		};
		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
				setmessage(response.data.message);
				setcolor('green');
				setPhoneNo('');
				setBusNo('');
				setTime('');
				setPassanger('');
				setIsload(false);
			})
			.catch((err) => {
				setIsload(false);
				console.log(err);
				setmessage(err.response.data.message);
				if (
					err.response.data.status == 400 ||
					err.response.data.status == 404
				) {
					setmessage('*No conductor exits with current phone number*');
				}
				setcolor('red');
			});
	}

	const deletetrip = (tripId) => {
		var axios = require('axios');

		var config = {
			method: 'delete',
			url: `${host.host}/trip/${tripId}`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
		};

		axios(config)
			.then((response) => {
				console.log(JSON.stringify(response.data));
				addtrip();
			})
			.catch((err) => {
				setIsload(false);
				console.log(err);
				setmessage(err.response.data.message);
				setcolor('red');
			});
	};

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
			timeOfDepatarture: getCrctTime(time),
			passengerNos: passangerNos,
		};

		// console.log(time);
		// console.log(t);
		// return;
		console.log(data);
		var config = {
			method: 'post',
			url: `${host.host}/trip`,
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
					setmessage(response.data.message);
					setcolor('green');
					setPhoneNo('');
					setBusNo('');
					setTime('');
					setPassanger('');
					setIsload(false);
				})
				.catch((err) => {
					console.log(err);
					if (err.response.status === 400 || err.response.status === 404) {
						setIsload(false);
						setmessage('*No conductor exits with current phone number*');
						setcolor('red');
					}
					if (err.response.status === 409) {
						var confirmbox = window.confirm(
							'Trip already exits! \nPhone: ' +
								phoneNo +
								' Busno: ' +
								err.response.data.bus_no +
								'\nDo you want to Modify it?'
						);
						if (confirmbox === true) {
							deletetrip(err.response.data.trip_id);
						} else {
							setIsload(false);
						}
					}
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
							Add Trip
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
								id="date-time"
								required
								// label="Date and Time of departure"
								// name="Date"
								variant="outlined"
								type="datetime-local"
								value={time}
								onChange={(evt) => {
									setTime(evt.target.value);
								}}
								// value={user.email}
								// onChange={onChange}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<button style={classes.button} className="defaultButtonHover1">
								Add Trip
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

export default AddTrip;
