import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import './Map.css';
import L from 'leaflet';
import { GpsFixedTwoTone } from '@mui/icons-material';
const MapCmp = ({ mapPosition }) => {
	const map = useMap();
	map.setView(mapPosition, 20);
	return null;
};

function DisplayMap(Location) {
	const mapPosition = [15.3173, 75.7139];
	var markerPosition = [Location.latitude, Location.longitude];
	// const map = useMap();
	var delay_num =
		(parseInt(Location.con_delay) + parseInt(Location.server_delay)) / 1000;
	var delay = delay_num.toFixed(1);
	if (delay < 0) delay = 0;
	useEffect(() => {
		console.log(Location.Tripend);
	}, [Location]);

	const [isRecenterClick, setIsRecenterClicked] = useState(false);
	const handleChangeView = () => {
		console.log('recenter');
		setIsRecenterClicked(true);
		setTimeout(() => {
			setIsRecenterClicked(false);
		}, 200);
	};

	var busIcon = new L.Icon({
		iconUrl: require('./937129.png'),
		shadowUrl: require('./icon_shadow.png'),
		iconSize: [50, 52],
		shadowSize: [50, 60],
		iconAnchor: [24, 49],
		shadowAnchor: [2, 45],
		popupAnchor: [0, -45],
	});

	return (
		<div>
			<div className="map-body">
				<div className="bar">
					<div className="text-bar">
						NORTH WESTERN KARNATAKA ROAD TRANSPORT CORPORATION
					</div>
				</div>
				<GpsFixedTwoTone
					style={{
						position: 'absolute',
						top: 100,
						right: 30,
						zIndex: 10000000,
						fontFamily: 'inherit',
						fontSize: '50px',
						fontWeight: 'bold',
					}}
					className="focus_recenter"
					onClick={handleChangeView}
				/>
				<div id="map" className="map">
					<div
						style={{
							position: 'absolute',
							bottom: 30,
							right: 30,
							zIndex: 10000,
							fontFamily: 'inherit',
							fontSize: '1.5em',
							fontWeight: 'bold',
						}}
					>
						<fieldset
							style={{
								backgroundColor: 'white',
								borderRadius: '5px',
							}}
						>
							{delay > 300 || Location.Tripend ? (
								<div>
									<legend>⚠️Error</legend>
									<div>Conductor offline</div>
									<div>/ Trip has ended</div>
								</div>
							) : (
								<div>
									<legend>Updated</legend>
									<div>{delay} s ago</div>
								</div>
							)}
						</fieldset>
					</div>
					<MapContainer center={mapPosition} zoom={7}>
						{isRecenterClick && <MapCmp mapPosition={markerPosition} />}
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						/>
						<Marker position={markerPosition} icon={busIcon}>
							<Popup>{Location.busNo}</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</div>
	);
}

export default DisplayMap;
