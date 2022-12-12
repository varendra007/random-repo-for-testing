import React, { Component } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Maplocation from './component/map/Maplocation';
import SignIn from './component/forms/login/SignIn';
import Userform from './component/forms/login/User';
import Admin from './component/Admin/Admin';
import ModifyUser from './component/Admin/Modifyuser';
import DeleteUser from './component/Admin/Deleteuser';
import ViewProfile from './component/Admin/Viewprofile';
import AddUser from './component/forms/login/AddUser';
import Tripview from './component/Controller/Tripview';
import ModifyTrip from './component/Controller/Modifytrip';
import ChangePassword from './component/Password/ChangePassword';
import ForgotNewPassword from './component/Password/ForgotNewPassword';
import ForgotPassword from './component/Password/ForgotPassword';
import Controller from './component/Controller/Controller';
import Conductor from './component/Conductor/Conductor';
import AddTrip from './component/Controller/AddTrip';
import AccessDenied from './component/AccessDenied/index';
import ViewUser from './component/Admin/ViewUsers';
import GetUser from './component/Admin/Getuser';
import GetTrip from './component/Controller/GetTrip';
import DeleteTrip from './component/Controller/DeleteTrip';
import ViewConductors from './component/Controller/ViewConductors';
import AddTripsFromTripSheet from './component/Admin/AddTripsFromTripSheet';
const router = createBrowserRouter([
	{
		path: '/signin',
		element: (
			<div>
				<SignIn />
			</div>
		),
	},
	{
		path: '/',
		element: (
			<div>
				<Userform></Userform>
			</div>
		),
	},
	{
		path: 'change-password',
		element: (
			<div>
				<ChangePassword />
			</div>
		),
	},
	{
		path: 'get-user',
		element: (
			<div>
				<GetUser />
			</div>
		),
	},
	{
		path: 'get-trip',
		element: (
			<div>
				<GetTrip />
			</div>
		),
	},
	{
		path: 'delete-trip',
		element: (
			<div>
				<DeleteTrip />
			</div>
		),
	},
	{
		path: 'add-user',
		element: (
			<div>
				<AddUser />
			</div>
		),
	},
	{
		path: 'modify-user',
		element: (
			<div>
				<ModifyUser />
			</div>
		),
	},
	{
		path: 'login',
		element: (
			<div>
				<SignIn />
			</div>
		),
	},
	{
		path: 'delete-user',
		element: (
			<div>
				<DeleteUser />
			</div>
		),
	},
	{
		path: 'view-trip',
		element: (
			<div>
				<Tripview />
			</div>
		),
	},
	{
		path: 'controller',
		element: (
			<div>
				<Controller />
			</div>
		),
	},
	{
		path: 'admin',
		element: (
			<div>
				<Admin />
			</div>
		),
	},
	{
		path: 'forgot-password',
		element: (
			<div>
				<ForgotPassword />
			</div>
		),
	},
	{
		path: 'conductor',
		element: (
			<div>
				<Conductor />
			</div>
		),
	},
	{
		path: 'access-denied',
		element: (
			<div>
				<AccessDenied />
			</div>
		),
	},
	{
		path: 'view-profile',
		element: (
			<div>
				<ViewProfile />
			</div>
		),
	},
	{
		path: 'modify-trip',
		element: (
			<div>
				<ModifyTrip />
			</div>
		),
	},
	{
		path: '/user',
		element: (
			<div>
				<Userform />
			</div>
		),
	},
	{
		path: '/map',
		element: (
			<div>
				<Maplocation />
			</div>
		),
	},
	{
		path: '/view-users',
		element: (
			<div>
				<ViewUser />
			</div>
		),
	},
	{
		path: '/add-trip',
		element: (
			<div>
				<AddTrip />
			</div>
		),
	},
	{
		path: '/reset-password',
		element: (
			<div>
				<ForgotNewPassword />
			</div>
		),
	},
	{
		path: '/View-Conductors',
		element: (
			<div>
				<ViewConductors />
			</div>
		),
	},
	{
		path: '/add-from-tripsheet',
		element: (
			<div>
				<AddTripsFromTripSheet />
			</div>
		),
	},
]);
class App extends Component {
	render() {
		return (
			<div
				className="App"
				style={{ maxWidth: '100vw', minHeight: '100vh', overflowX: 'hidden' }}
			>
				<RouterProvider router={router} />
			</div>
		);
	}
}

export default App;
