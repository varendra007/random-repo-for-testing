import * as React from 'react';
import './Admin.css';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
import './ViewProfile.css';
import AdminHeader from './AdminHeader';

// const classes = {
// 	button: {
// 		border: 'none',
// 		borderRadius: '100px',
// 		width: '150px',
// 		height: '55px',
// 		backgroundColor: '#fa2d64',
// 		color: '#ffffff',
// 		fontStyle: 'normal',
// 		fontFamily: 'Inter',
// 		fontWeight: '600',
// 		textAlign: 'center',
// 		fontSize: '26px',
// 		cursor: 'pointer',
// 	},
// 	fontname: {
// 		fontFamily: 'Inter',
// 	},
// };

const ViewProfile = () => {
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [phone, setPhone] = React.useState('');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [userData, setUserData] = React.useState({
		firstName: '',
		lastName: '',
		phoneNo: '',
		role: '',
		id: '',
	});
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
				setPhone(user.phone);
			} else if (user.role === 'ADMIN') {
				setIsRoutePermitted(true);
				setHomeUrl('/admin');
				setPhone(user.phone);
			} else if (user.role === 'CONTROLLER') {
				setIsRoutePermitted(true);
				setHomeUrl('/controller');
				setPhone(user.phone);
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
		if (!isRoutePermitted) {
			return;
		}
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/user/${phone}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
			},
		};

		axios(config)
			.then((response) => {
				console.log(JSON.stringify(response.data));
				setUserData({
					firstName: response.data.firstName,
					lastName: response.data.lastName,
					phoneNo: response.data.phoneNo,
					role: response.data.role,
					id: response.data.id,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}, [isRoutePermitted, phone]);
	return (
		<div>
			<AdminHeader homeUrl={homeUrl} />

			<h1
				style={{
					fontSize: '1.5em',
					fontWeight: 'bold',
					textAlign: 'center',
					paddingTop: '1%',
					fontFamily: 'inherit',
				}}
			>
				Profile
			</h1>
			<div className="flip-card">
				<div className="flip-card-inner">
					<div className="flip-card-front">
						<img
							src="https://www.w3schools.com/howto/img_avatar.png"
							alt="Avatar"
							style={{ width: '300px', height: '300px' }}
						/>
					</div>
					<div
						className="flip-card-back"
						style={{
							background: '#657786',
						}}
					>
						{userData.id && (
							<div style={{ paddingTop: '5%' }}>ID: {userData.id}</div>
						)}
						<div style={{ paddingTop: '5%' }}>
							Name: {userData.firstName} {userData.lastName}
						</div>
						<div style={{ paddingTop: '5%' }}>Phone: {userData.phoneNo}</div>
						<div style={{ paddingTop: '5%' }}>Role: {userData.role}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewProfile;
