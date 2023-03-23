import { useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';

function App() {
	return (
		<Routes>
			<Route index element={<Landing />}></Route>
			<Route path='/home' element={<Home />}></Route>
		</Routes>
	);
}

export default App;
