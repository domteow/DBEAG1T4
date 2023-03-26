import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loan.css';
import InputText from '../components/InputText';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


function LoanDetails() {
    const navigate = useNavigate();

    return (
		<div className='home'>
            <div className='mb-10 text-sm font-thin cursor-default' onClick={(event) => navigate('/loan')}>
                <ChevronLeftIcon className='h-4 w-4 inline-block'/>
                Back
            </div>
            
            <div className='loandetail'>
                <div className='loanheader'>
                    Borrower Details
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

            <button className='loanbutton'>
                Fund the loan
            </button>
		</div>
	);
}

export default LoanDetails;
