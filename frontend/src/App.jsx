import { useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
	return (
		<Routes>
			<Route index element={<Landing />}></Route>
		</Routes>
	);
}

export default App;
