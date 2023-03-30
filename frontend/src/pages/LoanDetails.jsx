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

    useEffect(() => {
        const loanInformation = {
                loanId: "1001100",
                loanAmt: 6000,
                loanInterestAmt: 100,
                loanPeriod: "30/3/2023 - 1/5/2023",
                loanRate: 5,
                loanRepaymentAmt: 100,
                loanRepaymentPeriod: 6,
                loanPurpose: "Hello World, I am here due to my need to fundraise for my oversea studies."
            };

        setLoanInfo(loanInformation)
    },loanInfo);

    function back_button() {
        if (location.pathname.split('/')[1] == "loan") {
            navigate('/loan')
        }
        else{
            navigate('/myloan')
        }
    }
    return (
		<div className='home'>
            <div className='mb-10 text-sm font-thin cursor-default' onClick={back_button}>
                <ChevronLeftIcon className='h-4 w-4 inline-block'/>
                Back
            </div>
            
            <div className='loandetail'>
                <PersonalDetails />
            </div>

            <div className='loandetail'>
                <div className='loanheader'>
                    Loan Details
                </div>
                <div className='loaninfo grid-cols-3'> 
                    <InputText label="Loan ID" value= {loanInfo['loanId']}/>
                    <InputText label="Loan Term" value= {loanInfo['loanTerm'] + " months"}/>
                    <InputText label="Loan Period" value= {loanInfo['loanPeriod']} />
                    <InputText label="Loan Amount" value= {"SGD $" + loanInfo['loanAmt']} />
                    <InputText label="Interest Rate" value= {loanInfo['loanRate'] + " %"}/>
                    <InputText label="Repayment Amount" value= {loanInfo['loanRepaymentAmt']} />
                    <InputText label="Repayment Period" value= {loanInfo['loanRepaymentPeriod'] + " months"}/>
                    <InputText label="Total Interest Amount" value= {"SGD $" + loanInfo['loanInterestAmt']}/>
                    <InputText label="Loan Purpose" value= {loanInfo['loanPurpose']}/>
                </div> 
            </div>
            {location.pathname.split('/')[1] == "loan" ? 
            <button className='loanbutton-details'>
                Fund the loan
            </button> : <div></div>}
		</div>
	);
}

export default LoanDetails;
