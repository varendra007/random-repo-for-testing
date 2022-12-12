import * as React from 'react';
import TextField from '@mui/material/TextField';
import host from '../../assest/host';
import '../../App.css';
import AdminHeader from '../Admin/AdminHeader';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
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

const ForgotPassword = () => {
	const [phone, setPhone] = React.useState('');

	const handlePhone = (evt) => {
		setPhone(evt.target.value);
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const data = {
			phoneNo: phone,
		};
		var axios = require('axios');
		var config = {
			method: 'post',
			url: `${host.host}/forgot-password`,
			data,
		};

		axios(config)
			.then((response) => {
				console.log(JSON.stringify(response.data));
			})
			.catch((err) => {
				console.log(err);
			});
	};
	// const [homeUrl, setHomeUrl] = React.useState('');

	return (
		<div>
			<div
				className="navbarx"
				style={{
					display: 'flex',
					justifyContent: 'center',
					// background: '#1d9bf0',
					background:
						'linear-gradient(to right, hsla(14, 93%, 53%, 1) 0%, #fa2d64  100%, #9bd9e8 100%) repeat scroll 0 0',
					// width: '100vw',
					minHeight: '8vh',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<h1
					style={{
						fontSize: '1.5em',
						fontWeight: 'bold',
						textAlign: 'center',
						paddingTop: '0',
						fontFamily: 'inherit',
						margin: '0',
						color: '#751919',
					}}
				>
					North Western Karnataka Road Transport Corporation
				</h1>
			</div>
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
					Enter Phone number to reset password
				</h1>
				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
						...classes.fontname,
					}}
					onSubmit={handleSubmit}
				>
					<TextField
						id="outlined-basic"
						label="Phone"
						name="phone"
						variant="outlined"
						type="number"
						value={phone}
						onChange={handlePhone}
						// errorText={errors.email}
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

export default ForgotPassword;
