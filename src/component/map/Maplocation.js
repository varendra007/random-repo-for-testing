import React from 'react';
import DisplayMap from './Map';
import { useEffect, useState } from 'react';
import axios from 'axios';
import host from '../../assest/host';

function Maplocation(props) {
	const [result, setResult] = useState({
		latitude: '15.3173000',
		longitude: '75.7139000',
	});
	const [delay, setDelay] = useState({
		con_delay: '0',
		server_delay: '0',
	});
	const [tripId, setTripId] = useState(
		new URL(window.location.href).searchParams.get('tripId')
	);
	const [busNo, setBusNo] = useState(
		new URL(window.location.href).searchParams.get('busNo')
	);
	const [tripend, setTripend] = useState(false);
	useEffect(() => {
		var url = new URL(window.location.href);
		setTripId(url.searchParams.get('tripId'));
		setBusNo(url.searchParams.get('busNo'));
	}, []);

	function sendrequest() {
		axios
			.get(`${host.host}/location/${tripId}`)
			.then((response) => {
				console.log(response.data);
				setResult({
					latitude: `${response.data.latitude}`,
					longitude: `${response.data.longitude}`,
				});
				setDelay({
					con_delay: `${response.data.server_delay}`,
					server_delay: `${response.data.conductor_delay}`,
				});
				console.log(result);
			})
			.catch((err) => {
				console.log(err);
				if (err.response.status === 404) {
					setTripend(true);
				}
			});
	}

	useEffect(() => {
		const interval = setInterval(() => {
			sendrequest();
		}, 2000);
		return () => clearInterval(interval);
	}, [result]);
	// console.log('busno1: ' + busNo);
	return (
		<div>
			<DisplayMap
				latitude={`${result.latitude}`}
				longitude={`${result.longitude}`}
				con_delay={`${delay.con_delay}`}
				server_delay={`${delay.server_delay}`}
				Tripend={tripend}
				busNo={busNo}
			></DisplayMap>
		</div>
	);
}

export default Maplocation;
