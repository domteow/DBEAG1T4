import React from 'react';
import '../styles/loan.css';

function InputText(props) {
    return (
        <div>
            <label className="font-light text-sm">{props.label}</label>
            <p className='text-lg font-normal'>{props.value}</p>
        </div>
    )
}

export default InputText;
