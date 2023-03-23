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
		console.log(encoded);

		fetch(API_URL + `?Header=${encoded}&ConsumerID=RIB`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (
					data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID !=
					'010000'
				) {
					return 'Error';
				} else {
					setUser(data.Content.ServiceResponse.CDMCustomer);
					navigate('/home');
				}
			});
	}

	const logout = () => {
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
