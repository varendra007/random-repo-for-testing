import * as React from 'react';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import './Admin.css';
import AdminHeader from './AdminHeader';
import '../Controller/zoom.css';

const classes = {
	button: {
		border: 'none',
		borderRadius: '0px',
		width: '100px',
		height: 'auto',
		// backgroundColor: '#fa2d64',
		color: '#ffffff',
		fontStyle: 'normal',
		fontFamily: 'Inter',
		fontWeight: 'medium',
		textAlign: 'center',
		fontSize: '1.25em',
		cursor: 'pointer',
		padding: '10px 15px',
		marginRight: '2%',
		marginLeft: '2%',
		marginTop: '2%',
	},
	fontname: {
		fontFamily: 'Inter',
	},
};
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));
const Admin = () => {
	// !Protecting routes using jwt
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);

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

	// ! Actions
	var actions = [
		{
			title: 'Add User',
			description: `Provide details here to add new user Admin, Controller and Conductor`,
			href: '/add-user',
		},
		{
			title: 'Get User',
			description: 'Provide phone number to get details of user respectively.',
			href: '/get-user',
		},
		{
			title: 'View User',
			description:
				'View the complete list of all users with the functionalities of modifying them.',
			href: '/view-users',
		},
		{
			title: 'Delete User',
			description: 'Delete user from their phone number.',
			href: '/delete-user',
		},
		{
			title: 'View Trip',
			description:
				'View the complete list of all Trips with the functionalities of modifying them.',
			href: '/view-trip',
		},
		{
			title: 'Get Trip',
			description:
				'Provide conductor phone number and bus number to get details of a trip.',
			href: '/get-trip',
		},
		{
			title: 'Add Trip',
			description: 'Add a new trip by providing relavant trip details.',
			href: '/add-trip',
		},
		{
			title: 'Delete Trip',
			description:
				'Provide conductor phone number and bus number to delete the corresponding trip.',
			href: '/delete-trip',
		},
		{
			title: 'Add trips from tripsheet',
			description: 'Add trips by pasting tripsheet.',
			href: '/add-from-tripsheet',
		},
	];
	return (
		<div>
			<AdminHeader homeUrl={homeUrl} />

			{/* <h1
				style={{
					fontSize: '1.5em',
					fontWeight: 'bold',
					textAlign: 'center',
					paddingTop: '1%',
					fontFamily: 'inherit',
				}}
			>
				North Western Karnataka Road Transport Corporation
			</h1> */}
			<div style={{}}>
				<Box
					sx={{ flexGrow: 1 }}
					direction="row"
					justifyContent="space-evenly"
					alignItems="center"
				>
					<Grid
						container
						// spacing={{ xs: 2, md: 3 }}
						columns={{ xs: 4, sm: 8, md: 12 }}
						direction="row"
						justifyContent="space-evenly"
						alignItems="center"
						// columnSpacing={12}
					>
						{actions.map((el, index) => (
							<Grid
								item
								xs={6}
								sm={4}
								md={2}
								key={index}
								className="griditem"
								style={{
									height: '250px',
									background: '#657786',
									margin: '10px',
									borderRadius: '12px',
									cursor: 'pointer',
									transform: 'revert-layer',
									color: 'white',
									display: 'flex',
									// justifyContent: 'center',
									alignItems: 'center',
									flexDirection: 'column',
								}}
								onClick={() => {
									window.location.href = `${el.href}`;
								}}
							>
								<h2 style={{ color: 'black' }}>{el.title}</h2>
								<div style={{ width: '82%' }}>
									<p
										style={{
											textAlign: 'center',
											wordWrap: 'break-word',
											width: '80%',
											fontSize: '1.1em',
											margin: 'auto',
										}}
									>
										{el.description}
									</p>
								</div>
							</Grid>
						))}
					</Grid>
				</Box>
			</div>
		</div>
	);
};

export default Admin;
