import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, setUser] = useState();
	const navigate = useNavigate();

	async function login(username, password) {
		const API_URL = import.meta.env.VITE_API_URL;
		const header = {
			serviceName: 'getCustomerDetails',
			userID: username,
			PIN: password,
			OTP: '999999',
		};

		const encoded = encodeURI(JSON.stringify(header));

		const res = await fetch(API_URL + `?Header=${encoded}&ConsumerID=RIB`)
			.then((response) => response.json())
			.then((data) => {
				if (
					data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID !=
					'010000'
				) {
					return false;
				} else {
					setUser(data.Content.ServiceResponse.CDMCustomer);
					localStorage.setItem(
						'user',
						JSON.stringify(data.Content.ServiceResponse.CDMCustomer)
					);
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
