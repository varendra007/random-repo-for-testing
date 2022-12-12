import React from 'react';
import host from '../../../assest/host';
import styles from './User.module.css';
import Loader from '../../AccessDenied/Loader';
import { useState } from 'react';
import './Icons.css';
import { useMediaQuery } from '@mui/material';
import { maxWidth } from '@mui/system';

function Userform() {
	const matches = useMediaQuery('(max-width:1200px)');
	console.log(window.screen.width);
	const [ph_no, setPhoneNo] = useState('');
	const [bus_no, setBusNo] = useState('');
	const [error, setError] = useState('');
	const [isLoad, setIsLoad] = useState(false);
	function handleChangephone(event) {
		setPhoneNo(event.target.value);
	}

	function handleChangebus(event) {
		setBusNo(event.target.value);
	}

	function Validate() {
		if (ph_no.length != 10 || bus_no == '') {
			setError('*Error in Phone-Number or Bus-Number*');
			return false;
		} else {
			setError('');
			return true;
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		console.log(ph_no);
		console.log(bus_no);
		var axios = require('axios');
		var data = {
			number: ph_no,
			bus_no: bus_no,
		};
		var config = {
			method: 'post',
			url: `${host.host}/get-key`,
			data: data,
		};
		var error = '';
		if (Validate()) {
			setIsLoad(true);
			axios(config)
				.then(function (response) {
					console.log(JSON.stringify(response.data));
					if (response.status === 200) {
						window.location.href = `/map?tripId=${response.data.key}&busNo=${data.bus_no}`;
					}
				})
				.catch((err) => {
					console.log(err);
					setIsLoad(false);
					error = err.response.data.message;
					setError(error);
				});
		}
	}
	// render() {
	return (
		<div>
			{/* <AdminHeader /> */}
			{isLoad ? (
				<Loader />
			) : (
				<>
					<div
						className="navbarx"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							// background: '#1d9bf0',
							background: '#657786',
							// width: '100vw',
							height: '8vh',
							alignItems: 'center',
							position: 'absolute',
							width: '100vw',
						}}
					>
						<div></div>
						<a href="/signin">Staff Login</a>
					</div>
					<div className={`${matches ? `${styles.bodyy}` : `${styles.bodyx}`}`}>
						<div className={styles.container}>
							<div className={`${styles.brandtitle} ${styles.tileKRTC}`}>
								Track Your Bus
							</div>
							{matches ? <div className={styles.brandlogo}></div> : <></>}
							<div className={styles.inputs}>
								<form onSubmit={handleSubmit}>
									{/* <label className={styles.labelx}>Phone Number</label> */}
									<div className={styles.inputx}>
										<span className="material-symbols-rounded">call</span>
										<input
											className={styles.inputy}
											type="number"
											required
											value={ph_no}
											onChange={handleChangephone}
											placeholder="Conductor Number"
										/>
									</div>
									{/* <label className={styles.labelx}>Bus Number</label> */}
									<div className={styles.inputx}>
										<span className="material-symbols-rounded">
											directions_bus
										</span>
										<input
											className={styles.inputy}
											type="text"
											required
											value={bus_no}
											onChange={handleChangebus}
											placeholder="Bus Number"
										/>
									</div>
									<button className={styles.buttonx} type="submit">
										SUBMIT
									</button>

									{error && (
										<div
											className="error"
											style={{
												color: 'red',
												fontSize: '0.7em',
												padding: '1%',
												textAlign: 'center',
											}}
										>
											{error}
										</div>
									)}
								</form>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
// }

export default Userform;
