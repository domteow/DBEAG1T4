import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import '../styles/login.css';
import logo from '/logo-no-background.png';
import { useAuth } from '../auth';

function Login() {
	const username = useRef();
	const password = useRef();

	const auth = useAuth();

	async function handleLogin(event) {
		console.log('asoiugd');
		event.preventDefault();
		console.log(auth);
		await auth
			.login(username.current.value, password.current.value)
			.then((response) => {
				if (!response) {
					console.log('asjigd');
				} else {
					console.log(response);
				}
			});
	}

	return (
		<div className='login'>
			<div
				className='login-box'
				// onSubmit={() =>
				// 	handleLogin(username.current.value, password.current.value)
				// }
			>
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
				<button
					type='submit'
					className='login-button'
					onClick={(e) => handleLogin(e)}
				>
					Login
				</button>
			</div>
		</div>
	);
}

export default Login;
