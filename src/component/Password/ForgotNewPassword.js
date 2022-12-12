import * as React from 'react';
import TextField from '@mui/material/TextField';
import host from '../../assest/host';
import '../../App.css';
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

const ForgotNewPassword = () => {
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
	const onSubmit = (event) => {
		event.preventDefault();

		var axios = require('axios');
		const data = {
			newPassword,
			confirmNewPassword,
		};

		console.log(data);
		var config = {
			method: 'post',
			url: `${host.host}/save-password?token=${new URL(
				window.location.href
			).searchParams.get('token')}`,
			data: data,
		};
		console.log(config.url);

		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
			})
			.catch((err) => {
				console.log(err);
			});

		// client server logic to sign in
	};
	return (
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
			<div className="loginBoxx">
				<h1
					style={{ fontSize: '1.5em', fontWeight: 'bold', ...classes.fontname }}
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
					<TextField
						type="password"
						id="outlined-basic"
						label="Password"
						name="password"
						variant="outlined"
						floatingLabelText="New Password"
						value={newPassword}
						onChange={(evt) => {
							setNewPassword(evt.target.value);
						}}
						// value={user.password}
						// onChange={onPwChange}
						// errorText={errors.password}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<TextField
						type="password"
						id="outlined-basic"
						label="Confirm Password"
						name="pwconfirm"
						variant="outlined"
						floatingLabelText="Confirm Password"
						value={confirmNewPassword}
						onChange={(evt) => {
							setConfirmNewPassword(evt.target.value);
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
				</form>
			</div>
		</div>
	);
};

export default ForgotNewPassword;
