import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Space} from 'antd';
import {CheckCircleIcon} from '@heroicons/react/20/solid';
import {XCircleIcon} from '@heroicons/react/20/solid';

function MyLoan() {
    const navigate = useNavigate();

    function goToDetails(event){
        const id = event.currentTarget.id;
        navigate('/myloan/' + id, {replace: true})
    }
    function makePayment(event){
        // send repayment calculation here
        console.log("Make repayment")
    }
    const columns_list_of_lenders = [
        {
            title: 'Loan ID',
            dataIndex: 'loanId',
            key: 'loanId',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Loan Amount',
            dataIndex: 'loanAmt',
            key: 'loanAmt',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Loan Terms',
            key: 'loanTerms',
            dataIndex: 'loanTerms',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Info',
            key: 'action',
            align: 'center',
            render: (text, record, index) => (
                <a id={record.loanId} onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
            )
        },
        {
            title: 'Accept/Deny',
            key: 'action',
            align: 'center',
            render: (text) => (
                <div className='flex around place-content-center'>
                    <CheckCircleIcon className='text-green-500 w-14'></CheckCircleIcon>
                    <XCircleIcon className="text-red-500 w-14"></XCircleIcon>
                </div>
            )
        }
        ];

        const data = [
        {
            loanId: '8',
            name: 'John Brown',
            loanAmt: 32000,
            loanTerms: '2 years',
            repaymentAmount: 1500,
        },
        {
            loanId: '8',
            name: 'Jim Green',
            loanAmt: 42000,
            loanTerms: '2 years',
            repaymentAmount: 2000,
        },
        {
            loanId: '9',
            name: 'Joe Black',
            loanAmt: 32000,
            loanTerms: '4 years',
            repaymentAmount: 1500,
        },
        ];

        const columns_confirmed_loans = [
            {
                title: 'Loan ID',
                dataIndex: 'loanId',
                key: 'loanId',
                align: 'center',
                render: (text) => <span className='font-normal'>{text}</span>
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: (text) => <span>{text}</span>,
            },
            {
                title: 'Loan Amount',
                dataIndex: 'loanAmt',
                key: 'loanAmt',
                align: 'center',
                render: (text) => <span className='font-normal'>{text}</span>
            },
            {
                title: 'Loan Terms',
                key: 'loanTerms',
                dataIndex: 'loanTerms',
                align: 'center',
                render: (text) => <span className='font-normal'>{text}</span>
            },
            {
                title: 'Info',
                key: 'action',
                align: 'center',
                render: (text, record) => (
                    <a id={record.loanId} onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
                )
            },
            {
                title: 'Repayment Amount',
                key: 'repaymentAmount',
                dataIndex: 'repaymentAmount',
                align: 'center',
                render: (text) => <span className='font-normal'>{text}</span>
            },
            // {Change Pay visibility, person==loaner, show repayment button}
            {
                title: 'Repayment',
                key: 'action',
                align: 'center',
                render: (text) => (
                    <button 
                    onClick={makePayment}
                    className='bg-green-500	rounded-full p-4 px-7'>Pay</button>
                )
            }
            ];

    return (
        <div className='home'>
            <div className='mb-10'>My Loans</div>
            {/* {If person==borrower, show table "List of Lenders"} */}
            <div className='text-lg mb-2'>List of Lenders</div>
            <Table
                columns= {columns_list_of_lenders}
                dataSource= {data}
                pagination={false}
                footer={() => ''}>
            </Table>
            <br></br>
            <div className='text-lg mb-2'>Confirmed Loans</div>
            <Table
                columns= {columns_confirmed_loans}
                dataSource= {data}
                pagination={false}
                footer={() => ''}>
            </Table>
        </div>
    )
    }

    export default MyLoan;
