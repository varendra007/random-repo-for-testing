/* eslint-disable no-loop-func */
import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from './AdminHeader';
import { ColorRing } from 'react-loader-spinner';
import getDataFromToken from '../../utils/jwtUtils/getDataFromToken';
import host from '../../assest/host';
const classes = {
	dropzone: {
		width: `100%`,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: '50px 0',
	},
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
};
export default function DropzoneComponent({ style }) {
	const [homeUrl, setHomeUrl] = React.useState('#');
	const [isRoutePermitted, setIsRoutePermitted] = React.useState(false);

	const [isUpdating, setIsUpdating] = useState(false);
	const [crewNo, setCrewNo] = useState(null);
	const [time, setTime] = useState(null);
	const [vehicleNo, setVehicleNo] = useState(null);

	const [error, setError] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [data, setData] = useState();
	var passangerNos = [];
	useEffect(() => {
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
	useEffect(() => {
		if (!data) {
			setTime();
			setCrewNo(null);
			setVehicleNo(null);
			passangerNos = [];
			return;
		}
		var k = 0;

		for (var i = 0; i < data.length; i++) {
			if (data[i] === ' ' || data[i] === '\r' || data[i] === '\t') {
				k = 1;
				break;
			}
		}
		if (k === 0) return;
		var x = data
			.split('\n')
			.join(',')
			.split('\r')
			.join(',')
			.split('\t')
			.join(',')
			.split(',');
		console.log(x);
		var i_time = x.indexOf('Depr. Time');
		var i_date = x.indexOf('Date of Journey');
		if (i_time === -1 || i_date === -1) {
			setTime(null);
		} else {
			i_date++;
			i_time++;
			var depTime = x[i_time].split(' ')[1];
			var depDate = x[i_date].split(' ')[1];
			var d = depDate.split('/').reverse().join('-');
			var departureTime = `${d}T${depTime}`;
			setTime(departureTime);
		}
		// console.log(depTime);
		var i_crew = x.indexOf('Crew No');
		if (i_crew === -1) {
			setCrewNo(null);
		} else {
			i_crew++;
			var crew = x[i_crew].split(' ')[1];
			setCrewNo(crew);
		}

		var i_vehicle = x.indexOf('Veh.No');

		if (i_vehicle === -1) {
			setVehicleNo(null);
		} else {
			i_vehicle++;
			console.log(x.indexOf('Veh.No'));
			var vehicle = x[i_vehicle].substring(2);
			setVehicleNo(vehicle);
		}

		// console.log(departureTime);
		// console.log(new Date(departureTime));
		// console.log(crew);
		// console.log(vehicle);

		for (var i = i_crew + 2; i < x.length; i++) {
			if (
				x[i].length === 10 &&
				parseInt(x[i][0]) >= 6 &&
				parseInt(x[i][0]) <= 9
			) {
				passangerNos.push(x[i]);
			}
		}
		console.log(passangerNos);
	}, [data]);
	const handleSubmit = () => {
		if (!data) return;
		setIsUpdating(true);
		// console.log(data);

		var axios = require('axios');
		console.log(time);
		var tripData = {
			conductorNo: crewNo,
			busNo: vehicleNo,
			timeOfDepatarture: new Date(time),
			passengerNos: passangerNos,
		};

		console.log(tripData);
		var config = {
			method: 'post',
			url: `${host.host}/trip`,
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
			},
			data: tripData,
		};
		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
				setIsUpdating(false);
				setUpdated(true);
				setError('');
			})
			.catch((err) => {
				setIsUpdating(false);
				setError(err.response.data.message);
				console.log(err);
			});
	};

	return (
		<div>
			<AdminHeader homeUrl={homeUrl} />
			<div
				// className="loginBoxqw"
				style={{
					// height: '200px',
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					width: '100vw',
					minWidth: '80vw',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<h2 style={{ margin: 0 }}>Add trip here</h2>
				<textarea
					rows="25"
					// cols="130"
					onChange={(e) => setData(e.target.value)}
					style={{ width: '90%' }}
					placeholder="Paste the details of tripsheet to generate a trip."
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{!updated && (
						<button
							style={{ ...classes.button, margin: '10px 0' }}
							className="defaultButtonHover1"
							onClick={handleSubmit}
						>
							Add Trip
						</button>
					)}
					{updated && (
						<p
							style={{
								textDecoration: 'underline',
								color: 'royalblue',
								cursor: 'pointer',
							}}
							onClick={() => {
								window.location.reload();
							}}
						>
							Trip added successfully, click here to add new.
						</p>
					)}
					{isUpdating && (
						<ColorRing
							visible={true}
							ariaLabel="blocks-loading"
							wrapperStyle={{}}
							wrapperClass="blocks-wrapper"
							colors={['#0a95ff', '#0a95ff', '#0a95ff', '#0a95ff', '#0a95ff']}
						/>
					)}
				</div>
				<p style={{ color: 'red' }}>{error}</p>
			</div>
			<h2>Details of the trip</h2>
			<p>Bus Number: {vehicleNo}</p>
			<p>Conductor No.: {crewNo}</p>
			{time && (
				<>
					<p>Departure Time: {new Date(time).toLocaleTimeString()}</p>
					<p>Departure Date: {new Date(time).toDateString()}</p>
				</>
			)}
		</div>
	);
}
