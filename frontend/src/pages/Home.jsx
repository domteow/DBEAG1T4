import React, { useEffect, useState } from 'react';
import PersonalDetails from '../components/PersonalDetails';
import '../styles/home.css';
import InputText from '../components/InputText';

function Home() {
	const userInfo = JSON.parse(localStorage.getItem('user'));
	const [accountList, setAccountList] = useState(undefined);
	const [selectedAccount, setSelectedAccount] = useState([]);

	useEffect(() => {
		const getAccountURL = 'http://localhost:5001/customer/getdetails';
		const Header = {
			serviceName: 'getCustomerAccounts',
			userID: localStorage.getItem('username'),
			PIN: localStorage.getItem('pin'),
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

		const res_acc = fetch(getAccountURL, options)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const account_list = [];
				const accounts =
					data['data']['Content']['ServiceResponse']['AccountList']['account'];
				setAccountList(accounts);
				setSelectedAccount(0);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	return (
		<div className='home'>
			<p>Welcome back, user</p>
			<p className='subtitle mb-4'>Your account at a glance</p>
			<div className='loandetail'>
				<PersonalDetails
					name={userInfo.givenName + ' ' + userInfo.familyName}
					creditScore='Very Good'
					nationality={userInfo.profile.nationality}
					occupation={userInfo.profile.occupation}
					type={userInfo.profile.customerType == '100' ? 'Retail' : 'Corporate'}
				/>
			</div>
			<div className='card account-details'>
				<p className='loanheader'>Account Summary</p>

				{accountList && (
					<div>
						<select
							name='test'
							id='test'
							onChange={(e) => setSelectedAccount(e.target.value)}
						>
							{accountList.map((account, i) => {
								return <option value={i}>{account.accountID}</option>;
							})}
						</select>
						<InputText
							label='Name'
							value={accountList[selectedAccount].accountID}
						/>
						<InputText
							label='Balance'
							value={accountList[selectedAccount].balance}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Home;
