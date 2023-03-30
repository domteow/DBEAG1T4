import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/loan.css';
import InputText from '../components/InputText';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


function LoanDetails() {
    const navigate = useNavigate();
    const location = useLocation();

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
                <div className='loanheader'>
                    Personnel Details
                </div>
                <div className='loaninfo grid-cols-2'>
                    <InputText label="Name" value="Wong Jing Yun"/>
                    <InputText label="Credit Score" value="A+"/>
                    <InputText label="Nationality" value="Singaporean"/>
                    <InputText label="Occupation" value="Lecturer"/>
                    <InputText label="Customer Type" value="Retail"/>
                </div>
            </div>

            <div className='loandetail'>
                <div className='loanheader'>
                    Loan Details
                </div>
                <div className='loaninfo grid-cols-3'>
                    <InputText label="Loan ID" value= "1001100"/>
                    <InputText label="Loan Term" value= "2 years"/>
                    <InputText label="Loan Amount" value= "SGD 6000"/>
                    <InputText label="Interest Rate" value= "5%"/>
                    <InputText label="Repayment Period" value= "6 months"/>
                    <InputText label="Loan Purpose" value= "I need money for personal business and housing"/>
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
