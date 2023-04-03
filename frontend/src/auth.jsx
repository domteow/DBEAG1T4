import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, setUser] = useState();
	const navigate = useNavigate();

	async function login(username, password) {
		const Header = {
			serviceName: 'getCustomerDetails',
			userID: username,
			PIN: password,
			OTP: '999999',
		};
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(Header),
		};

		const res = await fetch(
			'http://localhost:5001/customer/getdetails',
			options
		)
			.then((response) => response.json())
			.then((data) => {
				if (
					data.data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID !=
					'010000'
				) {
					return false;
				} else {
					setUser(data.data.Content.ServiceResponse.CDMCustomer);
					localStorage.setItem(
						'user',
						JSON.stringify(data.data.Content.ServiceResponse.CDMCustomer)
					);
					localStorage.setItem(
						'username',
						username
					)
					localStorage.setItem(
						'pin',
						password
					)
					return true;
				}
			});
		return res;
	}

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	return useContext(AuthContext);
};
