import React from 'react';
import '../styles/login.css';
import logo from '/logo-no-background.png';

function Login() {
	return (
		<div className='login'>
			<div className='login-box '>
				<img src={logo} className='h-[50px]' alt='' />

				<input
					className='rounded clearable w-full p-2 '
					placeholder='Username'
				/>
				<input
					type='password'
					className='rounded clearable w-full p-2'
					placeholder='Password'
				/>
				<button
					className='login-button'
					onClick={() => {
						setTimeout(() => navigate('/home'), 1000);
					}}
				>
					Login
				</button>
			</div>
		</div>
	);
}

export default Login;
