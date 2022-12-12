import { Search } from '@mui/icons-material';
import * as React from 'react';
import host from '../../assest/host';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import AdminHeader from '../Admin/AdminHeader';
import '../../App.css';
import { TableBody, TableCell, TableRow } from '@mui/material';
import Usetable from '../../assest/Usetable';

const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '100%',
		height: 'auto',
		// backgroundColor: 'rgb(29, 161, 242)',
		color: '#ffffff',
		fontStyle: 'normal',
		fontFamily: 'Inter',
		fontWeight: 'medium',
		textAlign: 'center',
		fontSize: '1.25em',
		cursor: 'pointer',
		padding: '10px 15px',
	},
	fontname: {
		fontFamily: 'Inter',
	},
};

const ViewConductors = () => {
	const [users, setUsers] = React.useState([]);
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	React.useEffect(() => {
		var user;
		if (window.localStorage.getItem('jwtToken')) {
			user = getDataFromToken(window.localStorage.getItem('jwtToken'));
			if (user.isExp) {
				localStorage.removeItem('jwtToken');
				window.location = '/';
			} else if (user.role === 'CONTROLLER') {
				setIsRoutePermitted(true);
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

	const handleUsers = () => {
		if (!isRoutePermitted) {
			return;
		}
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/users/conductor`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
			},
		};
		axios(config)
			.then((res) => {
				console.log(res.data);
				if (res.status === 200) {
					setUsers((prevData) => res.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	React.useEffect(() => {
		handleUsers();
		// setIsTripDeleted(false);
		// setTrips((prevTrips) => {});
	}, [isRoutePermitted]);

	// !Handling search
	const [filteredUsers, setFilteredUsers] = React.useState([]);
	const [searchQuery, setSearchQuery] = React.useState('');
	React.useEffect(() => {
		setFilteredUsers(users);
		if (searchQuery.trim().length !== 0) {
			handleSearch();
		}
	}, [users]);

	const handleSearch = () => {
		console.log('cleck');
		console.log();
		// evt.preventDefault();
		if (searchQuery.trim().length === 0) {
			setFilteredUsers(users);
			return;
		}
		var ft = [];
		var lcq = searchQuery.toLowerCase();
		users.map((el, ind) => {
			if (
				el.firstName.toLowerCase().search(lcq) != -1 ||
				el.phoneNo.toLowerCase().search(lcq) != -1 ||
				el.lastName.toLowerCase().search(lcq) != -1
			) {
				ft.push(el);
			}
			return false;
		});
		setFilteredUsers(ft);
		console.log(filteredUsers);
	};

	React.useEffect(() => {
		if (searchQuery.trim().length === 0) {
			setFilteredUsers(users);
		}
	}, [searchQuery, users]);

	const headcells = [
		{ id: 'firstName', label: 'First Name' },
		{ id: 'lastName', label: 'Last Name' },
		{ id: 'phoneNo', label: 'Phone Number' },
		{ id: 'role', label: 'Role' },
	];

	const { TblContainer, TblHead, TblPagination, recordsAfterPagination } =
		Usetable(filteredUsers, headcells);
	return (
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
				}}
			>
				North Western Karnataka Road Transport Corporation
			</h1> */}
			<h1
				style={{
					fontSize: '1.5em',
					fontWeight: 'bold',
					textAlign: 'center',
					paddingTop: '1%',
					fontFamily: 'inherit',
				}}
			>
				Conductors
			</h1>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<form
					style={{
						display: 'flex',
						justifyContent: 'center',
						// boxShadow: '1px 1px 1px 1px #888888',
						borderRadius: '10px',
						overflow: 'hidden',
						border: '2px solid rgba(0,0,0,0.3)',
					}}
					onSubmit={(evt) => {
						evt.preventDefault();
						handleSearch();
					}}
				>
					<input
						style={{
							width: '300px',
							height: '30px',
							outline: 'none',
							border: 'none',
							paddingLeft: '5px',
						}}
						value={searchQuery}
						onChange={(evt) => {
							setSearchQuery(evt.target.value);
						}}
						placeholder="Enter here to search..."
					/>
					<button
						style={{
							width: '40px',
							// height: '30px',
							outline: 'none',
							// background: 'red',
							border: 'none',
							margin: '0',
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Search />
					</button>
				</form>
			</div>
			<br />
			<div id="displaytrips" style={{ overflow: 'hidden' }}>
				<div
					id="tableLandlord"
					className="w-full overflow-auto"
					style={{ width: '100vw', overflow: 'auto' }}
				>
					{/* {filteredUsers.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">First Name</th>
									<th className="thx">Last Name</th>
									<th className="thx">Phone number</th>
									<th className="thx">Role</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((el, ind) => {
									return (
										<tr key={el.phoneNo}>
											<td className="tdx">{el.firstName}</td>
											<td className="tdx">{el.lastName}</td>
											<td className="tdx">{el.phoneNo}</td>
											<td className="tdx">{el.role}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
				{filteredUsers.length === 0 && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<br />
						<h1>No Users Found.</h1>
					</div>
				)} */}
					{filteredUsers.length > 0 && (
						<div>
							<TblPagination style={{ margin: '12.5%' }} />
							<TblContainer>
								<TblHead></TblHead>
								<TableBody>
									{recordsAfterPagination().map((el) => (
										<TableRow key={el.phoneNo}>
											<TableCell>{el.firstName}</TableCell>
											<TableCell>{el.lastName}</TableCell>
											<TableCell>{el.phoneNo}</TableCell>
											<TableCell>{el.role}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</TblContainer>
						</div>
					)}
				</div>
				{filteredUsers.length === 0 && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<br />
						<h1>No Conductors Found.</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewConductors;
