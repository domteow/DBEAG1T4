import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/links.css';

function SideNav() {
	return (
		<div className=' bg-card h-screen p-4'>
			<Link to='/home' className='link'>
				Home
			</Link>
		</div>
	);
}

export default SideNav;
