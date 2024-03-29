import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';
import {
	HomeIcon,
	UserCircleIcon,
	CurrencyDollarIcon,
	UserIcon,
} from '@heroicons/react/24/outline';
import NavItem from './common/NavItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';

function SideNav() {
	const navigate = useNavigate();
	const location = useLocation();
	const [arrow, setArrow] = useState(false);

	const auth = useAuth();
	const user = auth.user;
	console.log(user);
	return (
		<div className='nav'>
			<div className='nav-items'>
				<NavItem
					label='Home'
					Icon={() => <HomeIcon className='h-6 w-6' />}
					name='nav'
					id='home'
					onClick={() => navigate('home')}
					checked={location.pathname === '/home'}
				/>
				<NavItem
					label='View Loans'
					Icon={() => <CurrencyDollarIcon className='h-6 w-6' />}
					name='nav'
					id='loan'
					onClick={() => navigate('loan')}
					checked={location.pathname === '/loan'}
				/>

				<NavItem
					label='My Loans'
					Icon={() => <UserIcon className='h-6 w-6' />}
					name='nav'
					id='myloan'
					onClick={() => navigate('myloan')}
					checked={location.pathname === '/myloan'}
				/>
			</div>
			<div className='profile-panel'>
				<UserCircleIcon className='h-10 w-10 text-white' />
				<div>
					<p className='font-bold'>
						{user.givenName} {user.familyName}
					</p>
				</div>
				<button className='bg-card' onClick={() => auth.logout()}>
					Logout
				</button>
			</div>
		</div>
	);
}

export default SideNav;
