import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth';

function RequireAuth({ children }) {
	const auth = useAuth();

	const user = localStorage.getItem('userDetails');

	if (user) {
		auth.user = user;
	}

	if (!auth.user) {
		return <Navigate to='/login' />;
	}
	return children;
}

export default RequireAuth;
