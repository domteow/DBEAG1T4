import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import '../styles/login.css';
import logo from '/logo-no-background.png';
import { useAuth } from '../auth';

function Login() {
	const username = useRef();
	const password = useRef();
	const navigate = useNavigate();

	const auth = useAuth();

	async function handleLogin(event) {
		event.preventDefault();
		await auth
			.login(username.current.value, password.current.value)
			.then((response) => {
				if (!response) {
				} else {
					setTimeout(() => navigate('/home', { replace: true }), 1);
				}
			});
	}

	// function handleLogin(){
	// 	navigate('/home')
	// }

	return (
		<div className='login'>
			<form className='login-box' onSubmit={(e) => handleLogin(e)}>
				<img src={logo} className='h-[50px]' alt='' />

				<input
					className='rounded clearable w-full p-2 '
					placeholder='Username'
					ref={username}
				/>
				<input
					type='password'
					className='rounded clearable w-full p-2'
					placeholder='Password'
					ref={password}
				/>
				<button type='submit' className='login-button' onClick={handleLogin}>
					Login
				</button>
			</form>
		</div>
	);
}

export default Login;
