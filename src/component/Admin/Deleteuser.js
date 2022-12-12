import * as React from 'react';
import './Admin.css';

import TextField from '@mui/material/TextField';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
import AdminHeader from './AdminHeader';
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

const DeleteUser = () => {
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
	const [phone, setPhone] = React.useState('');
	const [message, setmessage] = React.useState();
	const [colorx, setcolor] = React.useState('red');
	const handlePhone = (evt) => {
		setPhone(evt.target.value);
	};
	function Validate() {
		if (phone === '') {
			setmessage('*Incorrect Input*');
			setcolor('red');
			return false;
		} else if (phone.length !== 10) {
			setmessage('*Incorrect Input*');
			setcolor('red');
			return false;
		} else {
			setmessage('');
			setcolor('green');
			return true;
		}
	}
	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');

		if (Validate()) {
			setIsload(true);
			var confirmbox = window.confirm('Are you sure, You want delete?');
			if (confirmbox === true) {
				var config = {
					method: 'delete',
					url: `${host.host}/user/${phone}`,
					headers: {
						Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
					},
				};
				axios(config)
					.then((response) => {
						console.log(JSON.stringify(response.data));
						setcolor('green');
						setmessage(response.data.message);
						setPhone('');
						setIsload(false);
					})
					.catch((err) => {
						setIsload(false);
						console.log(err);
						setcolor('red');
						setmessage(err.response.data.message);
					});
			}
		}
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
							Delete User
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
								required
								value={phone}
								onChange={handlePhone}
								// errorText={errors.email}
								style={{ width: '80%', ...classes.fontname }}
							/>
							<br />
							<button style={classes.button} className="defaultButtonHover1">
								Delete
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

export default DeleteUser;
