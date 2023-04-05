import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import '../styles/loan.css';
import { Select, Alert } from 'antd';
import InputText from '../components/InputText';
import PersonalDetails from '../components/PersonalDetails';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


function LoanDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loanInfo, setLoanInfo] = useState({});
    const [accountList, setAccountList] = useState([])
    const [account, setAccount] = useState("")
    const [error, setError] = useState("")
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const userId = localStorage.getItem('username')

    useEffect(() => {
        console.log(userInfo)
        const id = location.pathname.split('/')[2]
        const loanInformationURL = "http://127.0.0.1:5006/loanrequest/get/" + id
        const req = fetch(
            loanInformationURL
        )
        .then((response) => response.json())
        .then((data) => {
            const tableData = data["data"]
            setLoanInfo(tableData);
            console.log(tableData)
        })
        .catch((error) => {
            console.log(error)
        })
    },loanInfo);

    useEffect(() => {
        const getAccountURL = 'http://localhost:5001/customer/getaccounts'
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

        const res_acc = fetch(
			getAccountURL,
			options
		)
            .then((response) => response.json())
            .then((data) => {
                const account_list = []
                const accounts = data['data']['Content']['ServiceResponse']['AccountList']['account']
                accounts.forEach((acc) => {
                    let accDetails = {
                        "value": acc.accountID,
                        "label": acc.accountID
                    }
                    account_list.push(accDetails)
                })
                setAccountList(account_list)
                console.log(account_list)
            })
            .catch((error) => {
                console.log(error)
                setError(error)
            })
    }, [])

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setAccount(value)
    };

    function back_button() {
        if (location.pathname.split('/')[1] == "loan") {
            navigate('/loan')
        }
        else{
            navigate('/myloan')
        }
    }
    // loan term (from starting to fund loan to maturity date)
    // createLoanInfo['loan_term'] = calculateLoanTerm(maturity_date)
    function calculateLoanTerm(maturity){
        var maturityDate = moment(maturity, 'YYYY-MM-DD');
        var monthDiff = maturityDate.diff(Date.now(), 'months');
        return monthDiff;
    }

    // monthly payment + interest rate
    function calculate_monthly_installment(principal_amt, interest_rate, maturity, repayment_period){
        const loan_term = calculateLoanTerm(maturity)
        console.log(loan_term)
        const monthly_installment = ((principal_amt * (interest_rate/100) * (loan_term/12)) + principal_amt) / repayment_period
        console.log(principal_amt, interest_rate, loan_term, repayment_period)
        console.log(monthly_installment)
        return parseInt(monthly_installment)
    }

    function fundLoan(){

        const fundInformation = {
            // "loan_request_id": loanInfo['loan_request_id'],
            // "borrower_id": loanInfo['borrower_id'],
            "lender_id": userId,
            "lender_name": userInfo.givenName,
            "lender_nationality": userInfo.profile.nationality,
            "lender_occupation": userInfo.profile.occupation,
            "lender_type": userInfo.profile.customerType,
            "lender_account_num": account,
            "lender_phone": (userInfo.cellphone.countryCode) + (userInfo.cellphone.phoneNumber),
            "lender_email": userInfo.profile.email,
            "loan_term": loanInfo["loan_term"],
        }

        fundInformation["loan_term"] = calculateLoanTerm(loanInfo["maturity_date"])
        fundInformation["monthly_installment"] = calculate_monthly_installment(loanInfo["principal"], loanInfo["interest_rate"], loanInfo["maturity_date"], parseInt(loanInfo["repayment_period"]))

        // need add check that u are not lending your own loan request
        console.log(fundInformation)

        if (account){
            const fundLoanURL = 'http://localhost:5006/loanrequest/update/' + loanInfo['loan_request_id']
            const res = fetch(
            fundLoanURL,
            {   method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(fundInformation)})
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setError("")
                navigate("/myloan")
            })
            .catch((error) => {
                setError("An error happen when applying the loan")
                console.log(error)
            })
        }
        else{
            setError("Please input the account ID")
        }

        //PAYMENT
        const lenderPin = localStorage.getItem('pin')
        const paymentInfo = {
            "userID": userId,
            "PIN": lenderPin,
            "OTP": "999999",
            "payer_accountID": account ,
            "payee_accountID": loanInfo["borrower_account_num"],
            "loan_request_id": loanInfo["loan_request_id"],
            "commission": loanInfo["principal"] * 0.01,
            "payment_amount": loanInfo["principal"],
            "payer_name": userInfo.givenName,
            "payer_nationality": userInfo.profile.nationality,
            "payer_occupation": userInfo.profile.occupation,
            "payer_type": userInfo.profile.customerType,
            "payer_email": fundInformation["lender_email"],
            "payer_phone": fundInformation["lender_phone"] 
        }

        console.log(paymentInfo)
        const makePaymentURL = "http://localhost:5300/make_payment"

        const res = fetch(
            makePaymentURL,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(paymentInfo)})
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                })
                .catch((error) => {
                    console.log(error)
                })
    }
    
    return (
		<div className='home'>
            <div className='mb-10 text-sm font-thin cursor-default' onClick={back_button}>
                <ChevronLeftIcon className='h-4 w-4 inline-block'/>
                Back
            </div>
            
            <div className='loandetail'>
                { location.pathname.split('/')[1] == "loan" ? 
                    <PersonalDetails 
                    name= {loanInfo['borrower_name']} 
                    creditScore= "Very Good"
                    nationality= {loanInfo['borrower_nationality']}
                    occupation= {loanInfo['borrower_occupation']}
                    type= {loanInfo['borrower_type']}
                    /> : 
                
                loanInfo['borrower_id'] != userId ? 
                    <PersonalDetails 
                    name= {loanInfo['borrower_name']} 
                    creditScore= "Very Good"
                    nationality= {loanInfo['borrower_nationality']}
                    occupation= {loanInfo['borrower_occupation']}
                    type= {loanInfo['borrower_type']}
                    /> : 
                    <PersonalDetails 
                        name= {loanInfo['lender_name']} 
                        creditScore= "Very Good"
                        nationality= {loanInfo['lender_nationality']}
                        occupation= {loanInfo['lender_occupation']}
                        type= {loanInfo['lender_type']}
                    /> 
                }
            </div>

            <div className='loandetail'>
                <div className='loanheader'>
                    Loan Details
                </div>
                <div className='loaninfo grid-cols-3'> 
                    <InputText label="Loan ID" value= {loanInfo['loan_request_id']}/>
                    {loanInfo["loan_term"] !== "0" ? <InputText label="Loan Term" value= {loanInfo['loan_term'] + " months"}/> : <></>}
                    <InputText label="Repayment Duration" value= {loanInfo['start_date'] + " to " + loanInfo['maturity_date']} />
                    <InputText label="Loan Amount" value= {"SGD $" + loanInfo['principal']} />
                    <InputText label="Interest Rate" value= {loanInfo['interest_rate'] + " %"}/>
                    {loanInfo["monthly_installment"] !== 0 ? <InputText label="Repayment Amount" value= {"SGD $" + loanInfo['monthly_installment']} /> : <></>}
                    <InputText label="Repayment Period" value= {loanInfo['repayment_period'] + " months"}/>
                    <InputText label="Loan Purpose" value= {loanInfo['reason']}/>
                </div> 
            </div>
            {location.pathname.split('/')[1] == "loan" ? 
            <>
                {loanInfo['borrower_id'] != userId ?
                <>
                    <span style={{ width: 200, marginLeft: 10}}>Account ID: </span>
                    <Select
                        style={{ width: 200, marginLeft: 10}}
                        onChange={handleChange}
                        options={accountList}
                        /> 
                    <button className='loanbutton-details' onClick={fundLoan}>
                        Fund the loan
                    </button> 
                    { error !== "" ? <span clasName="text-base">{error}</span> : <></> }
                </>: <></>}
            </>
            : <div></div>}
            <span className="text-base" style={{ width: "full", margin: 10, color:"red"}}>{error}</span>  
		</div>
	);
}

export default LoanDetails;
