import * as React from 'react';
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

const ChangePassword = () => {
	const [pwState, setPwState] = React.useState({
		// phoneNo: '',
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [message, setmessage] = React.useState('');
	const [colorx, setcolor] = React.useState('red');
	const [isload, setIsload] = React.useState(false);
	function Validate() {
		if (
			// pwState.phoneNo.length != 10 ||
			pwState.oldPassword === '' ||
			pwState.confirmNewPassword === '' ||
			pwState.newPassword === ''
		) {
			setmessage('*Incorrect Input/s*');
			setcolor('red');
			return false;
		} else if (
			!(
				(pwState.newPassword.length >= 8 &&
					pwState.newPassword.length <= 255) ||
				(pwState.confirmNewPassword.length >= 8 &&
					pwState.confirmNewPassword.length <= 255)
			)
		) {
			setmessage('*Minimum length of Password should be 8*');
			setcolor('red');
			return false;
		} else if (pwState.newPassword != pwState.confirmNewPassword) {
			setmessage('*New Password not matching with Confirm Password*');
			setcolor('red');
			return false;
		} else {
			setmessage('');
			setcolor('green');
			return true;
		}
	}

	const onSubmit = (event) => {
		if (!isRoutePermitted) return;
		event.preventDefault();
		var axios = require('axios');
		const data = {
			// phoneNo: pwState.phoneNo,
			oldPassword: pwState.oldPassword,
			newPassword: pwState.newPassword,
			confirmNewPassword: pwState.confirmNewPassword,
		};
		console.log(data);
		if (Validate()) {
			setIsload(true);
			var config = {
				method: 'post',
				url: `${host.host}/change-password`,
				headers: {
					Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
				},
				data: data,
			};

			axios(config)
				.then(function (response) {
					console.log(response);
					setcolor('green');
					setPwState(() => {
						return {
							...pwState,
							oldPassword: '',
							newPassword: '',
							confirmNewPassword: '',
							phoneNo: '',
						};
					});
					setmessage(response.data.message);
					setIsload(false);
				})
				.catch((err) => {
					setIsload(false);
					console.log(err.response);
					setcolor('red');
					setmessage(err.response.data.message);
				});
		}
		// client server logic to sign in
	};

	React.useEffect(() => {
		var user;
		if (window.localStorage.getItem('jwtToken')) {
			user = getDataFromToken(window.localStorage.getItem('jwtToken'));
			if (user.isExp) {
				localStorage.removeItem('jwtToken');
				window.location = '/';
			} else if (user.role === 'CONDUCTOR') {
				setIsRoutePermitted(true);
				setHomeUrl('/conductor');
			} else if (user.role === 'ADMIN') {
				setIsRoutePermitted(true);
				setHomeUrl('/admin');
			} else if (user.role === 'CONTROLLER') {
				setHomeUrl('/controller');
			} else {
				setIsRoutePermitted(false);
				window.location.href = '/access-denied';
			}
		} else {
			localStorage.removeItem('jwtToken');
			window.location = '/';
		}
	}, []);
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
            {!(homeUrl === "/conductor") && (
              <a href="/view-profile">View Profile</a>
            )}
            <a
              href="/"
              onClick={() => {
                localStorage.removeItem("jwtToken");
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
							Change Password
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
							{/* <TextField
						id="outlined-basic"
						label="Phone"
						name="Phone"
						variant="outlined"
						type="number"
						value={pwState.phoneNo}
						onChange={(evt) => {
							setPwState((prevState) => {
								return {
									...prevState,
									phoneNo: evt.target.value,
								};
							});
						}}
						// errorText={errors.email}
						style={{ width: '80%', ...classes.fontname }}
					/> */}
							<br />
							<TextField
								id="outlined-basic"
								label="Old Password"
								name="oldPassword"
								variant="outlined"
								type="password"
								required
								value={pwState.oldPassword}
								onChange={(evt) => {
									setPwState((prevState) => {
										return {
											...prevState,
											oldPassword: evt.target.value,
										};
									});
								}}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<TextField
								type="password"
								id="outlined-basic"
								label="New Password"
								name="password"
								required
								variant="outlined"
								floatingLabelText="New Password"
								value={pwState.newPassword}
								onChange={(evt) => {
									setPwState((prevState) => {
										return {
											...prevState,
											newPassword: evt.target.value,
										};
									});
								}}
								// errorText={errors.password}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<TextField
								type="password"
								id="outlined-basic"
								label="Confirm New Password"
								name="pwconfirm"
								required
								variant="outlined"
								floatingLabelText="Confirm Password"
								value={pwState.confirmNewPassword}
								onChange={(evt) => {
									setPwState((prevState) => {
										return {
											...prevState,
											confirmNewPassword: evt.target.value,
										};
									});
								}}
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
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChangePassword;
