import { useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import SideNavLayout from './layouts/SideNavLayout';
import './index.css';

// const ProtectedRoute = ({ user, redirectPath = '/landing' }) => {
//   if (!user) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <Outlet />;
// };

function App() {
	return (
		<Routes>
			<Route path='login' element={<Login />}></Route>
			<Route path='/' element={<SideNavLayout />}>
				<Route path='home' element={<Home />}></Route>
			</Route>
		</Routes>
	);
}

export default App;
