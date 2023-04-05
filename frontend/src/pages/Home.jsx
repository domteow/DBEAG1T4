import React, { useEffect, useState } from 'react';
import PersonalDetails from '../components/PersonalDetails';
import '../styles/home.css';

function Home() {
	const userInfo = JSON.parse(localStorage.getItem('user'));
	
	return (
		<div className='home'>
			<p>Welcome back, user</p>
			<p className='subtitle mb-4'>Your account at a glance</p>
			<div className='loandetail'>
				<PersonalDetails 
					name = {userInfo.givenName + " " + userInfo.familyName}
					creditScore = "Very Good"
					nationality = {userInfo.profile.nationality}
					occupation = {userInfo.profile.occupation}
					type = {userInfo.profile.customerType == "100" ? "Retail" : "Corporate"}
				/>
			</div>
		</div>
	);
}

export default Home;
