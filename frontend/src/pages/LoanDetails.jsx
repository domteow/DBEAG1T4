import { React, useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import '../styles/loan.css';
import InputText from '../components/InputText';
import PersonalDetails from '../components/PersonalDetails';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


function LoanDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loanInfo, setLoanInfo] = useState({});
    const [error, setError] = useState("")
    const id = 1;

    useEffect(() => {
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

    function back_button() {
        if (location.pathname.split('/')[1] == "loan") {
            navigate('/loan')
        }
        else{
            navigate('/myloan')
        }
    }

    function fundLoan(){
        const fundInformation = {
            "loan_request_id": loanInfo['loan_request_id'],
            "borrower_id": loanInfo['borrower_id'],
            "lender_id": '2'
        }

        const fundLoanURL = 'http://localhost:5007/loanrequest/create'
        const res = fetch(
            fundLoanURL,
            {   method: 'POST',
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
                setError("An error happen when creating the loan")
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
                <PersonalDetails 
                    name= {loanInfo['borrower_name']} 
                    creditScore= "A"
                    nationality= {loanInfo['borrower_nationality']}
                    occupation= {loanInfo['borrower_occupation']}
                    type= {loanInfo['borrower_type']}
                />
            </div>

            <div className='loandetail'>
                <div className='loanheader'>
                    Loan Details
                </div>
                <div className='loaninfo grid-cols-3'> 
                    <InputText label="Loan ID" value= {loanInfo['loan_request_id']}/>
                    <InputText label="Loan Term" value= {loanInfo['loanTerm'] + " months"}/>
                    <InputText label="Loan Period" value= {loanInfo['maturity_date']} />
                    <InputText label="Loan Amount" value= {"SGD $" + loanInfo['principal']} />
                    <InputText label="Interest Rate" value= {loanInfo['interest_rate'] + " %"}/>
                    <InputText label="Repayment Amount" value= {loanInfo['monthly_installment']} />
                    <InputText label="Repayment Period" value= {loanInfo['loanRepaymentPeriod'] + " months"}/>
                    <InputText label="Loan Purpose" value= {loanInfo['reason']}/>
                </div> 
            </div>
            {location.pathname.split('/')[1] == "loan" ? 
            <button className='loanbutton-details' onClick={fundLoan}>
                Fund the loan
            </button> : <div></div>}
		</div>
	);
}

export default LoanDetails;
