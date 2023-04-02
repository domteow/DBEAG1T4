import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import '../styles/loan.css';
import {Form, Input, Select, InputNumber, DatePicker, Alert, Space} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;


function CreateLoan() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const layout = {
        labelCol: {
            span: 5,
        }
    };

    function calculateLoanTerm(start, end){ 
        var startDate = moment(start, 'DD-MM-YYYY');
        var endDate = moment(end, 'DD-MM-YYYY');
        var monthDiff = endDate.diff(startDate, 'months');
        return monthDiff + 1
    }

    function calculateLoanRepaymentAmt(loanAmt, loanRate, loanTerm, loanRepaymentPeriod){
        const totalAmt = loanAmt * (1 + (loanRate/100))
        const numberOfPayments = loanTerm / loanRepaymentPeriod
        return  Math.round(totalAmt/numberOfPayments);
    }

    function calculateInterestAmt(loanAmt, loanRate){
        return Math.round(loanAmt * loanRate);
    }

    const onFinish = (values) => {
        const createLoanURL = "http://localhost:5006/loanrequest/create"
        const createLoanInfo = {
            "amount_left": null,
            "borrower_account_num": "12345",
            "borrower_id": "1",
            "borrower_name": "Kevlin",
            "borrower_nationality": "Singapore",
            "borrower_occupation": "Student",
            "borrower_type": "Retail",
            "lender_id": null,
            "status": "request"
        }

        let start = values['loanPeriod'][0].format('DD-MM-YYYY');
        let maturity_date = values['loanPeriod'][1].format('DD-MM-YYYY');

        values['loanPeriod'] = start + " - " + maturity_date
        values['loanTerm'] = calculateLoanTerm(start, maturity_date)
        values['loanRepaymentAmt'] = calculateLoanRepaymentAmt(values['principal'], values['interest_rate'], values['loanTerm'], values['loanRepaymentPeriod'])
        values['loanInterestAmt'] = calculateInterestAmt(values['loanAmt'], values['loanRate'])

        createLoanInfo["interest_rate"] = values["interest_rate"] / 100
        createLoanInfo["monthly_installment"] = values['loanRepaymentAmt']
        createLoanInfo["principal"] = values["principal"] * 1.01
        createLoanInfo["reason"] = values["reason"]
        createLoanInfo["maturity_date"] = maturity_date

        console.log(createLoanInfo)

        const res = fetch(
            createLoanURL,
            {   method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(createLoanInfo)})
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
    };

    return (
        <div className='home '>
            <div className='mb-10 text-sm font-thin cursor-default' onClick={() => {navigate('/loan')}}>
                <ChevronLeftIcon className='h-4 w-4 inline-block'/>
                Back
            </div>
            <div className='bg-white rounded-md h-full'>
                <div className='loan-header text-black p-5 mb-5'>
                    <div>Create Loan</div>
                </div>
                {error !== "" ? <Alert className="mx-8 mb-5 w-1/2" message={error} type="error" showIcon /> : <></>}
                <div>
                    <Form
                        {...layout}
                        name="createLoan"
                        onFinish={onFinish}
                        // initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                        scrollToFirstError
                        className='font-normal w-4/5'
                        >

                        <Form.Item name="loanPeriod" label="Loan Period" rules={[{required: true,},]}>
                            <RangePicker className='w-full'  />
                        </Form.Item>

                        <Form.Item name="principal" label="Loan Amount" rules={[{required: true,},]}>
                            <InputNumber addonBefore="SGD $" className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="interest_rate" label="Interest Rate" rules={[{required: true,},]}>
                            <InputNumber addonAfter="%" className='w-1/5' />
                        </Form.Item>

                        <Form.Item name="loanRepaymentPeriod" label="Repayment Period" rules={[{required: true,},]}>
                            <InputNumber addonAfter={"months"} className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="reason" label="Loan Purpose" rules={[{required: true,},]}>
                            <TextArea rows={4}  />
                        </Form.Item>

                        <Form.Item
                            >
                            <button type="primary" htmlType="submit" className='float-right rounded-md bg-lime-600 py-2 px-6'>
                                Submit
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            
        </div>
    )
    }

    export default CreateLoan;
