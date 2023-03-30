import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Space} from 'antd'

function MyLoan() {
    const navigate = useNavigate();
    const id = 1;

    function goToDetails(event){
        navigate('/loan/' + id, {replace: true})
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
            render: (text) => (
                <a onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
            )
        },
        ];

        const data = [
        {
            loanId: '1',
            name: 'John Brown',
            loanAmt: 32000,
            loanTerms: '2 years',
        },
        {
            loanId: '2',
            name: 'Jim Green',
            loanAmt: 42000,
            loanTerms: '2 years',
        },
        {
            loanId: '3',
            name: 'Joe Black',
            loanAmt: 32000,
            loanTerms: '4 years',
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
                render: (text) => (
                    <a onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
                )
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
