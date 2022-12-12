import * as React from 'react';
import './Controller.css';
import TextField from '@mui/material/TextField';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
import AdminHeader from '../Admin/AdminHeader';
import '../../App.css';
import Loader from '../AccessDenied/Loader';
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
const convertDate = (time) => {
	var date = `${new Date(time).getDate()}`;
	if (date.length === 1) {
		date = `0${date}`;
	}

	var month = `${new Date(time).getMonth() + 1}`;
	if (month.length === 1) {
		month = `0${month}`;
	}
	var hours = `${new Date(time).getHours()}`;
	if (hours.length === 1) {
		hours = `0${hours}`;
	}
	var minutes = `${new Date(time).getMinutes()}`;
	if (minutes.length === 1) {
		minutes = `0${minutes}`;
	}

	var timeOfDepatarture = `${new Date(
		time
	).getFullYear()}-${month}-${date}T${hours}:${minutes}`;
	return {
		month,
		hours,
		minutes,
		timeOfDepatarture,
	};
};

const GetTrip = () => {
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [phoneNo, setPhoneNo] = React.useState('');
	const [busNo, setBusNo] = React.useState('');
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');
	const [phonenum, setPhonenum] = React.useState('');
	const [Busno, setBusno] = React.useState('');
	const [time, setTime] = React.useState('');
	const [isload, setIsload] = React.useState(false);
	function Validate() {
		var regex = /^KA-\d{2}-[A-Z]{1,2}-\d{4}$/;
		if (phoneNo.length !== 10 || busNo === '') {
			setmessage('*Incorrect input/s*');
			setcolor('red');
			return false;
		} else if (!regex.test(busNo)) {
			setmessage('*Incorrect Bus number format*');
			setcolor('red');
			return false;
		} else {
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

	const onSubmit = (event) => {
		event.preventDefault();
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');
		const data = {
			number: phoneNo,
			bus_no: busNo,
		};

		console.log(data);
		var config = {
			method: 'post',
			url: `${host.host}/get-key`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
			data: data,
		};

		if (Validate()) {
			setIsload(true);
			axios(config)
				.then(function (response) {
					console.log(response);
					console.log(JSON.stringify(response.data));
					setBusno(busNo);
					setPhonenum(phoneNo);
					setTime(response.data.start_time);
					setcolor('green');
					setPhoneNo('');
					setBusNo('');
					setIsload(false);
				})
				.catch((err) => {
					console.log(err);
					setmessage(err.response.data.message);
					if (err.response.data.status === 500) {
						setmessage('*No conductor exits with current phone number*');
					}
					setBusno('');
					setPhonenum('');
					setTime('');
					setcolor('red');
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
                window.localStorage.removeItem("jwtToken");
                window.location = "/";
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
							Get Trip
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
								placeholder="eg:KA-12-M-9468"
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
							<div
								style={{
									color: '	#800080',
									fontSize: '1em',
									padding: '1%',
									textAlign: 'center',
									fontFamily: 'monospace',
								}}
							>
								{phonenum}
							</div>
							<div
								style={{
									color: '	#800080',
									fontSize: '1em',
									padding: '1%',
									textAlign: 'center',
									fontFamily: 'monospace',
								}}
							>
								{Busno}
							</div>
							<div
								style={{
									color: '	#800080',
									fontSize: '1em',
									padding: '1%',
									textAlign: 'center',
									fontFamily: 'monospace',
								}}
							>
								{time != '' ? (
									<div>
										{new Date(
											new Date(time).getTime() + 330 * 60000
										).toDateString()}{' '}
										{
											new Date(new Date(time).getTime() + 330 * 60000)
												.toString()
												.split(' ')[4]
										}
									</div>
								) : (
									''
								)}
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default GetTrip;
