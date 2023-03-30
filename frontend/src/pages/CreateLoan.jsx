import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import '../styles/loan.css';
import {Form, Input, Select, InputNumber, DatePicker} from 'antd';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

function CreateLoan() {
    const navigate = useNavigate();

    const layout = {
        labelCol: {
            span: 5,
        }
    };

    function calculateLoanTerm(start, end){ 
      var startDate = moment(start, 'DD/MM/YYYY');
      var endDate = moment(end, 'DD/MM/YYYY');
      var monthDiff = endDate.diff(startDate, 'months');
      return monthDiff
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
        let start = values['loanPeriod'][0].format('DD/MM/YYYY');
        let end = values['loanPeriod'][1].format('DD/MM/YYYY');

        values['loanPeriod'] = start + " - " + end
        values['loanTerm'] = calculateLoanTerm(start, end)
        values['loanRepaymentAmt'] = calculateLoanRepaymentAmt(values['loanAmt'], values['loanRate'], values['loanTerm'], values['loanRepaymentPeriod'])
        values['loanInterestAmt'] = calculateInterestAmt(values['loanAmt'], values['loanRate'])

        console.log(values)
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

                        <Form.Item name="loanAmt" label="Loan Amount" rules={[{required: true,},]}>
                            <InputNumber addonBefore="SGD $" className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="loanRate" label="Interest Rate" rules={[{required: true,},]}>
                            <InputNumber addonAfter="%" className='w-1/5' />
                        </Form.Item>

                        <Form.Item name="loanRepaymentPeriod" label="Repayment Period" rules={[{required: true,},]}>
                            <InputNumber addonAfter={"months"} className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="loanPurpose" label="Loan Purpose" rules={[{required: true,},]}>
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
