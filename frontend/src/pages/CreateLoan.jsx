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
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // Number of months borrower has to make the full payment
    function calculateRepaymentPeriod(start, maturity){ 
        var startDate = moment(start, 'YYYY-MM-DD');
        var maturityDate = moment(maturity, 'YYYY-MM-DD');
        var monthDiff = maturityDate.diff(startDate, 'months');
        return monthDiff
    }

    function calculateNextDateOfRepayment(start_date, repayment_period){
        return moment(start_date).add(repayment_period, 'M').format('YYYY-MM-DD');
    }

    // function calculateLoanRepaymentAmt(loanAmt, loanRate, loanTerm, loanRepaymentPeriod){
    //     const totalAmt = loanAmt * (1 + (loanRate/100))
    //     const numberOfPayments = loanTerm / loanRepaymentPeriod
    //     return  Math.round(totalAmt/numberOfPayments);
    // }

    // function calculateInterestAmt(loanAmt, loanRate){
    //     return Math.round(loanAmt * loanRate);
    // }

    const onFinish = (values) => {
        console.log(userInfo)

        const createLoanURL = "http://localhost:5006/loanrequest/create"
        const createLoanInfo = {
            "amount_left": null,
            "borrower_id": localStorage.getItem('username'),
            "borrower_name": userInfo.givenName,
            "borrower_nationality": userInfo.profile.nationality,
            "borrower_occupation": userInfo.profile.occupation,
            "borrower_type": userInfo.profile.customerType,
            "borrower_PIN": localStorage.getItem('pin'),
            "borrower_phone": (userInfo.cellphone.countryCode) + (userInfo.cellphone.phoneNumber),
            "borrower_email": userInfo.profile.email,
            "lender_id": null,
            "lender_name": null,
            "lender_nationality": null, 
            "lender_occupation": null,
            "lender_type": null,
            "lender_account_num": null,
            "lender_email": null,
            "lender_phone": null,
            "loan_term": 0,
            "monthly_installment": 0,
            "status": "request"
        }

        // start of repayment
        let start_date = values['repayment_duration'][0].format('YYYY-MM-DD');
        createLoanInfo["start_date"] = start_date
        // date of final loan repayment
        let maturity_date = values['repayment_duration'][1].format('YYYY-MM-DD');
        createLoanInfo["maturity_date"] = maturity_date
        // number of months borrower has to make full repaymnet
        createLoanInfo['repayment_period'] = calculateRepaymentPeriod(start_date, maturity_date)
        // annual interest rate
        createLoanInfo["interest_rate"] = values["interest_rate"]
        // principal amount
        createLoanInfo["amount_left"] = values["principal"] 
        createLoanInfo["principal"] = values["principal"] 
        // loan purpose
        createLoanInfo["reason"] = values["reason"]
        // borrower account number
        createLoanInfo["borrower_account_num"] = values["borrower_account_num"]
        // next repayment date 
        createLoanInfo["date_of_next_repayment"] = calculateNextDateOfRepayment(start_date, values["repayment_period"])
        
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
                <div className='loan-header text-black px-5 pt-5 mb-3'>
                    <div>Create Loan</div>
                </div>
                {error !== "" ? <Alert className="mx-8 mb-5 w-1/2" message={error} type="error" showIcon /> : <></>}
                <div>
                    <Form
                        {...layout}
                        name="createLoan"
                        onFinish={onFinish}
                        scrollToFirstError
                        className='font-normal w-4/5'
                        >

                        <Form.Item name="principal" label="Loan Amount" rules={[{required: true,},]}>
                            <InputNumber addonBefore="SGD $" className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="interest_rate" label="Interest Rate" rules={[{required: true,},]}>
                            <InputNumber addonAfter="%" className='w-1/5' />
                        </Form.Item>

                        <Form.Item name="repayment_duration" label="Repayment Duration" rules={[{required: true,},]}>
                            <RangePicker className='w-full' picker="month" placeholder={['Repayment Start Date', 'Maturity Date']} />
                        </Form.Item>

                        {/* <Form.Item name="repayment_period" label="Repayment Period" rules={[{required: true,},]}>
                            <InputNumber addonAfter={"months"} className='w-2/5' />
                        </Form.Item> */}

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
