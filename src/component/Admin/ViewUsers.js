import { Search } from '@mui/icons-material';
import * as React from 'react';
import host from '../../assest/host';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import AdminHeader from './AdminHeader';
import '../../App.css';
import Usetable from '../../assest/Usetable';
import { TableBody, TableCell, TableRow, Zoom } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
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
const BootstrapTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.common.black,
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.black,
	},
}));
const ViewUser = () => {
	const [users, setUsers] = React.useState([]);
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);
	const [role, setRole] = React.useState('all');
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

	const handleUsers = () => {
		if (!isRoutePermitted) {
			return;
		}
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/users/${role}`,
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
	}, [isRoutePermitted, role]);

	const handleDelete = (phone) => {
		if (!isRoutePermitted) {
			window.location.href = '/access-denied';
			return;
		}
		var axios = require('axios');
		console.log(phone);
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
				handleUsers();
			})
			.catch((err) => {
				if (err.response.status === 400) {
					alert(err.response.data.message);
				}
				console.log(err);
			});
	};
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
		console.log(users);
		users.map((el, ind) => {
			if (
				el.firstName.toLowerCase().search(lcq) !== -1 ||
				el.phoneNo.toLowerCase().search(lcq) !== -1 ||
				el.lastName.toLowerCase().search(lcq) !== -1 ||
				el.role.toLowerCase().search(lcq) !== -1 ||
				(el.id && el.id.toLowerCase().search(lcq) !== -1)
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
		{ id: 'modify', label: 'Modify' },
		{ id: 'delete', label: 'Delete' },
	];

	const { TblContainer, TblHead, TblPagination, recordsAfterPagination } =
		Usetable(filteredUsers, headcells);

	const handleRole = (event) => {
		console.log(event.target.value);
		setRole(event.target.value);
	};

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
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
			<select
				style={{
					width: 'auto',
					height: 'auto',
					// fontSize: '1.25em',
					outline: '0px',
					border: '0px',
					fontSize: '1.5em',
					fontWeight: 'bold',
					marginBottom: '1%',
					fontFamily: 'inherit',
					cursor: 'pointer',
					padding: '0.5%',
					appearance: 'none',
					// textDecoration: 'underline',
					textAlign: 'center',
					color: '#198bd2',
				}}
				id="outlined-basic"
				label="Role"
				name="role"
				variant="outlined"
				value={role}
				onChange={handleRole}
			>
				<option value="all">&nbsp;All Users</option>
				<option value="conductor">&nbsp;Conductors</option>
				<option value="controller">&nbsp;Controllers</option>
				<option value="admin">&nbsp;Admins</option>
			</select>
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
					{filteredUsers.length > 0 && (
						<div>
							<div style={{ display: 'flex' }}>
								<TblPagination />
							</div>
							<TblContainer>
								<TblHead></TblHead>
								<TableBody>
									{recordsAfterPagination().map((el) => (
										<Tooltip
											key={el.phoneNo}
											title={el.id}
											followCursor
											TransitionComponent={Zoom}
										>
											<TableRow key={el.phoneNo}>
												<TableCell>{el.firstName}</TableCell>
												<TableCell>{el.lastName}</TableCell>
												<TableCell>
													{el.phoneNo}
													<br />
													{el.id && `(${el.id})`}
												</TableCell>
												<TableCell>{el.role}</TableCell>
												<TableCell>
													<button
														className="modifyq"
														onClick={() => {
															window.location.href = `/modify-user?phoneNo=${
																el.phoneNo
															}&firstName=${el.firstName}&lastName=${
																el.lastName
															}&role=${el.role}&id=${el.id || ''}`;
														}}
													>
														Modify
													</button>
												</TableCell>
												<TableCell>
													<button
														className="modifyq"
														onClick={() => {
															var confirmBox = window.confirm(
																'Are you sure, you want to delete?'
															);
															if (confirmBox === true) {
																handleDelete(el.phoneNo);
															}
														}}
													>
														Delete
													</button>
												</TableCell>
											</TableRow>
										</Tooltip>
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
						<h1>No Users Found.</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewUser;
