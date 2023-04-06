import React, { useEffect, useState } from 'react';
import PersonalDetails from '../components/PersonalDetails';
import '../styles/home.css';
import InputText from '../components/InputText';

function Home() {
	function isObjEmpty(obj) {
		return Object.keys(obj).length === 0;
	}
	const userInfo = JSON.parse(localStorage.getItem('user'));
	const [accountList, setAccountList] = useState(undefined);
	const [accountDetail, setAccountDetail] = useState(undefined);
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
				const accounts =
					data['data']['Content']['ServiceResponse']['AccountList']['account'];

				setAccountList(accounts);
				setSelectedAccount(0);
				getAccountHistory(accounts[0]);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	function handleAccountChange(e) {
		setSelectedAccount(e.target.value);
		getAccountHistory(accountList[e.target.value]);
	}

	function getAccountHistory(account) {
		const getAccountURL = 'http://localhost:5001/customer/getaccounthistory';
		const Header = {
			serviceName: 'getTransactionHistory',
			userID: localStorage.getItem('username'),
			PIN: localStorage.getItem('pin'),
			OTP: '999999',
		};
		const Content = {
			accountID: account.accountID,
			startDate: account.accountOpenDate,
			endDate: new Date(),
			numRecordsPerPage: '100',
			pageNum: '1',
		};
		const bodyJSON = { Header, Content };
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(bodyJSON),
		};

		const res_acc = fetch(getAccountURL, options)
			.then((response) => response.json())
			.then((data) => {
				let finAccDet = [];
				const accountDet =
					data['data']['Content']['ServiceResponse']['CDMTransactionDetail'][
						'transaction_Detail'
					];
				if (!accountDet) {
					setAccountDetail([]);
				} else if (isObjEmpty(accountDet)) {
					setAccountDetail([]);
				} else if (Object.keys(accountDet).length === 20) {
					setAccountDetail([accountDet]);
				} else {
					setAccountDetail(accountDet.reverse());
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
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
					<div className='grid grid-cols-2'>
						<div>
							<select
								name='test'
								id='test'
								onChange={(e) => handleAccountChange(e)}
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
						{accountDetail && (
							<div
								className='over overflow-auto'
								style={{ maxHeight: '200px' }}
							>
								Account History
								{accountDetail.map((transaction) => {
									if (
										transaction.accountTo ==
										accountList[selectedAccount].accountID
									) {
										return (
											<div className='grid grid-cols-[1fr_1fr] card-sm bg-white'>
												<div>
													<p>From:</p>
													<p>{transaction.accountFrom}</p>
												</div>
												<div>
													<p>Amount:</p>
													<p>{transaction.transactionAmount}</p>
												</div>
											</div>
										);
									} else {
										return (
											<div className='grid grid-cols-[1fr_1fr] card-sm bg-white'>
												<div>
													<p>To:</p>
													<p>{transaction.accountTo}</p>
												</div>
												<div>
													<p>Amount:</p>
													<p>{transaction.transactionAmount}</p>
												</div>
											</div>
										);
									}
								})}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Home;
