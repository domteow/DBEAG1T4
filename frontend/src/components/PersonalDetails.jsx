import React from 'react';
import '../styles/loan.css';
import InputText from '../components/InputText';


function PersonalDetails(){
    return (
        <div>
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
    )
}

export default PersonalDetails;
