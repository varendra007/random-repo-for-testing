import * as React from 'react';
import TextField from '@mui/material/TextField';
import './style.css';
import getDataFromToken from '../../../utils/jwtUtils/getDataFromToken';
import host from '../../../assest/host';
import Loader from '../../AccessDenied/Loader';
import '../../../App.css';
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

const SignInForm = () => {
	const [phone, setPhone] = React.useState('');
	const [password, setPassword] = React.useState('');
	const storedToken = localStorage.getItem('jwtToken');
	const [token, setToken] = React.useState(storedToken || null);
	const [isLoad, setIsload] = React.useState(false);
	const [errors, setErrors] = React.useState({
		phone: '',
		password: '',
	});
	const [message, setmessage] = React.useState('');

	function Validate() {
		if (phone == '' || password == '') {
			setmessage('*Incorrect Credentials*');
			return false;
		} else if (phone.length != 10) {
			setmessage('*Incorrect Credentials*');
			return false;
		} else {
			setmessage('');
			return true;
		}
	}
	const handlePassword = (event) => {
		setPassword(event.target.value);
	};
	const handlePhone = (event) => {
		setPhone(event.target.value);
	};

	React.useEffect(() => {
		if (token) {
			console.log(token);
			console.log(getDataFromToken(token));
			const user = getDataFromToken(token);
			if (!user.isExp) {
				if (user.role === 'ADMIN') {
					// direct to admin
					window.location = '/admin';
				} else if (user.role === 'CONTROLLER') {
					// direct to controller
					window.location = '/controller';
				} else if (user.role === 'CONDUCTOR') {
					window.location = '/conductor';
					// direct to CONDUCTOR
				}
			} else {
				localStorage.removeItem('jwtToken');
				window.location = '/';
			}
		}
	}, [token]);
	const onSubmit = (event) => {
		event.preventDefault();
		var axios = require('axios');
		const data = {
			phoneNo: `${phone}`,
			password: `${password}`,
		};

		console.log(data);
		if (Validate()) {
			setIsload(true);
			var config = {
				method: 'post',
				url: `${host.host}/login`,
				// headers: {
				// 	Authorization: 'Token 395edf78f391f3acaa6b21d87e322ea817792735',
				// },
				data: data,
			};

			axios(config)
				.then(function (response) {
					console.log(JSON.stringify(response.data));
					if (response.status === 200) {
						localStorage.setItem('jwtToken', `${response.data.token}`);
						setToken(response.data.token);
						setmessage('');
					}
				})
				.catch((err) => {
					setIsload(false);
					if (err.response.status === 0) {
						setmessage(err.message);
					}
					console.log(err);
					setmessage(err.response.data.message);
				});
		}

		// client server logic to sign in
	};
	return (
		<div>
			{isLoad ? (
				<Loader />
			) : (
				<div>
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
					<div className="loginBox">
						<h1 style={{ fontSize: '38px', ...classes.fontname }}>Login</h1>
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
							<TextField
								id="outlined-basic"
								label="Phone"
								required
								variant="outlined"
								name="phone"
								value={phone}
								onChange={handlePhone}
								errorText={errors.phone}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<TextField
								id="outlined-basic"
								label="Password"
								variant="outlined"
								required
								type={'password'}
								name="password"
								value={password}
								onChange={handlePassword}
								errorText={errors.password}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<button style={classes.button} className="defaultButtonHover1">
								Submit
							</button>
							<br />

							<a className="ax" href="/forgot-password">
								Forgot Password?
							</a>
							<div
								style={{
									color: 'red',
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

export default SignInForm;
