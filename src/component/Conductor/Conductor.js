import * as React from 'react';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
// import logout from '../../utils/logout';
import ViewProfile from '../Admin/Viewprofile';
import '../../App.css';
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

const Conductor = () => {
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);

	React.useEffect(() => {
		var user;
		if (window.localStorage.getItem('jwtToken')) {
			user = getDataFromToken(window.localStorage.getItem('jwtToken'));
			if (user.isExp) {
				localStorage.removeItem('jwtToken');
				window.location = '/';
			} else if (user.role !== 'CONDUCTOR') {
				// return <div>chutiya</div>;
				// ! Access is denied
				window.location.href = '/access-denied';
			} else {
				setIsRoutePermitted(true);
			}
		} else {
			localStorage.removeItem('jwtToken');
			window.location = '/';
		}
	}, []);

	return (
		<div>
			<ViewProfile />
			<div className="loginBoxl">
				<button
					onClick={() => {
						window.location.href = '/get-user';
					}}
					style={classes.button}
					className="defaultButtonHover1"
				>
					Get User
				</button>
				{/* <a style={classes.button} href="/get-user">
        Get User
      </a> */}
			</div>
			<br />
		</div>
	);
};

export default Conductor;
