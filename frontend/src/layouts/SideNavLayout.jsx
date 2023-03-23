import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav';

function SideNavLayout(props) {
	return (
		<div className='grid grid-cols-[250px,1fr] w-full'>
			<SideNav />
			<Outlet />
		</div>
	);
}

export default SideNavLayout;
