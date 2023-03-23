import { useState } from 'react';
import './App.css';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import SideNavLayout from './layouts/SideNavLayout';
import './index.css';
import RequireAuth from './components/common/RequireAuth';
import { AuthProvider } from './auth';
function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path='login' element={<Login />}></Route>
				<Route
					path='/'
					element={
						<RequireAuth>
							<SideNavLayout />
						</RequireAuth>
					}
				>
					<Route path='home' element={<Home />}></Route>
				</Route>
			</Routes>
		</AuthProvider>
	);
}

export default App;
