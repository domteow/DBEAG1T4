import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/links.css';
import { HomeIcon } from '@heroicons/react/24/outline';
import NavItem from './common/NavItem';
import { useNavigate, useLocation } from 'react-router-dom';

function SideNav() {
	const navigate = useNavigate();
	const location = useLocation();
	return (
		<div className='nav'>
			<NavItem
				label='Home'
				Icon={() => <HomeIcon className='h-6 w-6' />}
				name='nav'
				id='home'
				onClick={() => navigate('home')}
				checked={location.pathname === '/home'}
			/>
		</div>
	);
}

export default SideNav;
