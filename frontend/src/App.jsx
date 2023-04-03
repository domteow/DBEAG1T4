import { useState } from 'react';
import './App.css';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import AllLoans from './pages/AllLoans'
import LoanDetails from './pages/LoanDetails'
import MyLoan from './pages/MyLoan'
import SideNavLayout from './layouts/SideNavLayout';
import CreateLoan from './pages/CreateLoan';
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
					<Route path='loan/:detail' element={<LoanDetails />}></Route>
					<Route path='loan' element={<AllLoans />}></Route>
					<Route path='myloan/:detail' element={<LoanDetails />}></Route>
					<Route path='myloan' element={<MyLoan />}></Route>
					<Route path='create/loan' element={<CreateLoan />}></Route>
				</Route>
			</Routes>
		</AuthProvider>
	);
}

export default App;
