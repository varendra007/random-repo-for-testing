import { Search } from '@mui/icons-material';
import * as React from 'react';
import host from '../../assest/host';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import AdminHeader from '../Admin/AdminHeader';
import './Controller.css';
import '../../App.css';
import Usetable from '../../assest/Usetable';
import { TableBody, TableCell, TableRow } from '@mui/material';

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

const Tripview = () => {
	const [trips, setTrips] = React.useState([]);
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
			} else if (user.role === 'CONTROLLER') {
				setHomeUrl('/controller');
				setIsRoutePermitted(true);
			} else {
				setIsRoutePermitted(false);
				window.location.href = '/access-denied';
			}
		} else {
			localStorage.removeItem('jwtToken');
			window.location = '/';
		}
	}, []);

	const handleTrips = () => {
		if (!isRoutePermitted) {
			return;
		}
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/trips`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
			},
		};
		axios(config)
			.then((res) => {
				console.log(res.data);
				if (res.status === 200) {
					setTrips((prevTrips) => res.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	React.useEffect(() => {
		handleTrips();
		// setIsTripDeleted(false);
		// setTrips((prevTrips) => {});
	}, [isRoutePermitted]);

	const handleDelete = (tripId) => {
		var axios = require('axios');

		var config = {
			method: 'delete',
			url: `${host.host}/trip/${tripId}`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
		};

		axios(config)
			.then((response) => {
				console.log(JSON.stringify(response.data));
				handleTrips();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// !Handling search
	const [filteredTrips, setFilteredTrips] = React.useState([]);
	const [searchQuery, setSearchQuery] = React.useState('');
	React.useEffect(() => {
		setFilteredTrips(trips);
		if (searchQuery.trim().length !== 0) {
			handleSearch();
		}
	}, [trips]);

	const handleSearch = () => {
		console.log('cleck');
		console.log();
		// evt.preventDefault();
		if (searchQuery.trim().length === 0) {
			setFilteredTrips(trips);
			return;
		}
		var ft = [];
		trips.map((el, ind) => {
			if (
				el.busNo.search(searchQuery) != -1 ||
				el.conductor.phoneNo.search(searchQuery) != -1
			) {
				ft.push(el);
			}
			return false;
		});
		setFilteredTrips(ft);
		console.log(filteredTrips);
	};

	React.useEffect(() => {
		if (searchQuery.trim().length === 0) {
			setFilteredTrips(trips);
		}
	}, [searchQuery, trips]);

	const convertDate = (el) => {
		var date = `${new Date(el.timeOfDepatarture).getDate()}`;
		if (date.length === 1) {
			date = `0${date}`;
		}

		var month = `${new Date(el.timeOfDepatarture).getMonth() + 1}`;
		if (month.length === 1) {
			month = `0${month}`;
		}
		var hours = `${new Date(el.timeOfDepatarture).getHours()}`;
		if (hours.length === 1) {
			hours = `0${hours}`;
		}
		var minutes = `${new Date(el.timeOfDepatarture).getMinutes()}`;
		if (minutes.length === 1) {
			minutes = `0${minutes}`;
		}

		var timeOfDepatarture = `${new Date(
			el.timeOfDepatarture
		).getFullYear()}-${month}-${date}T${hours}:${minutes}`;
		return {
			month,
			hours,
			minutes,
			timeOfDepatarture,
		};
	};

	const headcells = [
		{ id: 'conductorphonenumber', label: 'Conductor Phone Number' },
		{ id: 'date', label: 'Date' },
		{ id: 'time', label: 'Time' },
		{ id: 'busnumber', label: 'Bus number' },
		{ id: 'modify', label: 'Modify' },
		{ id: 'delete', label: 'Delete' },
		{ id: 'check', label: 'View Trip' },
	];

	const { TblContainer, TblHead, TblPagination, recordsAfterPagination } =
		Usetable(filteredTrips, headcells);

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
								localStorage.removeItem('jwtToken');
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
				Trips
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
						placeholder="Enter Conductor or Bus No. to search..."
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
					style={{ width: '100%', overflow: 'auto' }}
				>
					{/* {filteredTrips.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">Conductor Phone Number</th>
									<th className="thx">Date</th>
									<th className="thx">Time</th>
									<th className="thx">Bus number</th>
									<th className="thx">Modify</th>
									<th className="thx">Delete</th>
									<th className="thx">View Trip</th>
								</tr>
							</thead>
							<tbody>
								{filteredTrips.map((el, ind) => {
									return (
										<tr key={el.tripId}>
											<td className="tdx">{el.conductor.phoneNo}</td>
											<td className="tdx">
												{convertDate(el).timeOfDepatarture.substring(0, 10)}
											</td>
											<td className="tdx">
												{`${convertDate(el).hours}:${convertDate(el).minutes}`}
											</td>
											<td className="tdx">{el.busNo}</td>
											<td className="tdx">
												<button
													className="modifyq"
													onClick={() => {
														const timeOfDep = convertDate(el);
														window.location.href = `/modify-trip?tripId=${el.tripId}&phoneNo=${el.conductor.phoneNo}&busNo=${el.busNo}&time=${timeOfDep.timeOfDepatarture}`;
													}}
												>
													Modify
												</button>
											</td>
											<td className="tdx">
												<button
													className="modifyq"
													onClick={() => {
														const confirmBox = window.confirm(
															'Are you sure, you want delete?'
														);
														if (confirmBox === true) {
															handleDelete(el.tripId);
														}
													}}
												>
													Delete
												</button>
											</td>
											<td className="tdx">
												<button
													className="modifyq"
													onClick={() => {
														window.location.href = `/map?tripId=${el.tripId}&busNo=${el.busNo}`;
													}}
												>
													Check
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
				{filteredTrips.length === 0 && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<br />
						<h1>No Trips Found.</h1>
					</div>
				)} */}
					{filteredTrips.length > 0 && (
						<div>
							<TblPagination />
							<TblContainer>
								<TblHead></TblHead>
								<TableBody>
									{recordsAfterPagination().map((el) => (
										<TableRow key={el.tripId}>
											<TableCell>{el.conductor.phoneNo}</TableCell>
											<TableCell>
												{convertDate(el).timeOfDepatarture.substring(0, 10)}
											</TableCell>
											<TableCell>{`${convertDate(el).hours}:${
												convertDate(el).minutes
											}`}</TableCell>
											<TableCell>{el.busNo}</TableCell>
											<TableCell>
												<button
													className="modifyq"
													onClick={() => {
														const timeOfDep = convertDate(el);
														window.location.href = `/modify-trip?tripId=${el.tripId}&phoneNo=${el.conductor.phoneNo}&busNo=${el.busNo}&time=${timeOfDep.timeOfDepatarture}`;
													}}
												>
													Modify
												</button>
											</TableCell>
											<TableCell>
												<button
													className="modifyq"
													onClick={() => {
														const confirmBox = window.confirm(
															'Are you sure, you want delete?'
														);
														if (confirmBox === true) {
															handleDelete(el.tripId);
														}
													}}
												>
													Delete
												</button>
											</TableCell>
											<TableCell>
												<button
													className="modifyq"
													onClick={() => {
														window.location.href = `/map?tripId=${el.tripId}&busNo=${el.busNo}`;
													}}
												>
													Check
												</button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</TblContainer>
						</div>
					)}
				</div>
				{filteredTrips.length === 0 && (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<br />
						<h1>No Trips Found.</h1>
					</div>
				)}
			</div>
		</div>
	);
};

export default Tripview;
