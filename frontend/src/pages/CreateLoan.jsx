import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import '../styles/loan.css';
import {Form, Input, Select, InputNumber, DatePicker, Alert, Space} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;


function CreateLoan() {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [accountList, setAccountList] = useState([])

    const layout = {
        labelCol: {
            span: 5,
        }
    };

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
            })
    }, [])

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
        console.log(userInfo)

        const createLoanURL = "http://localhost:5006/loanrequest/create"
        const createLoanInfo = {
            "amount_left": null,
            "borrower_id": userInfo.customer.customerID,
            "borrower_name": userInfo.givenName,
            "borrower_nationality": userInfo.profile.nationality,
            "borrower_occupation": userInfo.profile.occupation,
            "borrower_type": userInfo.profile.customerType,
            "monthly_installment": "null",
            "lender_id": null,
            "status": "request"
        }

        let start_date = values['loan_period'][0].format('DD-MM-YYYY');
        let maturity_date = values['loan_period'][1].format('DD-MM-YYYY');
        createLoanInfo['loan_term'] = calculateLoanTerm(start_date, maturity_date)
        createLoanInfo["repayment_period"] = values["repayment_period"]
        createLoanInfo["interest_rate"] = values["interest_rate"]
        createLoanInfo["principal"] = values["principal"] * 1.01
        createLoanInfo["reason"] = values["reason"]
        createLoanInfo["start_date"] = start_date
        createLoanInfo["maturity_date"] = maturity_date
        createLoanInfo["borrower_account_num"] = values["borrower_account_num"]

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
                navigate("/loan")
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

                        <Form.Item name="loan_period" label="Loan Period" rules={[{required: true,},]}>
                            <RangePicker className='w-full'  />
                        </Form.Item>

                        <Form.Item name="principal" label="Loan Amount" rules={[{required: true,},]}>
                            <InputNumber addonBefore="SGD $" className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="interest_rate" label="Interest Rate" rules={[{required: true,},]}>
                            <InputNumber addonAfter="%" className='w-1/5' />
                        </Form.Item>

                        <Form.Item name="repayment_period" label="Repayment Period" rules={[{required: true,},]}>
                            <InputNumber addonAfter={"months"} className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="reason" label="Loan Purpose" rules={[{required: true,},]}>
                            <TextArea rows={4}  />
                        </Form.Item>

                        <Form.Item name="borrower_account_num" label="Account Number" rules={[{required: true,},]}>
                        <Select
                            style={{ width: 300}}
                            options={accountList}
                        />
                        </Form.Item>


                        <Form.Item>
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
