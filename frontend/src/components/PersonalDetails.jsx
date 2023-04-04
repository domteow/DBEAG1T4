import React, {useState} from 'react';
import '../styles/loan.css';
import InputText from '../components/InputText';


function PersonalDetails(props){
    return (
        <div>
            <div className='loanheader'>
                    Personnel Details
            </div>
            <div className='loaninfo grid-cols-2'>
                <InputText label="Name" value={props.name}/>
                <InputText label="Credit Score" value={props.creditScore}/>
                <InputText label="Nationality" value={props.nationality}/>
                <InputText label="Occupation" value={props.occupation}/>
                <InputText label="Customer Type" value={props.type == 100 ? 'Retail' : 'Corporate'}/>
            </div>
        </div>
    )
}

export default PersonalDetails;
