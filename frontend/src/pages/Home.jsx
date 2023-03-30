import React from 'react';
import PersonalDetails from '../components/PersonalDetails';
import '../styles/home.css';

function Home() {
	return (
		<div className='home'>
			<p>Welcome back, user</p>
			<p className='subtitle mb-4'>Your account at a glance</p>
			<div className='loandetail'>
				<PersonalDetails />
			</div>
		</div>
	);
}

export default Home;
