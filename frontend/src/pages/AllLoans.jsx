import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Space} from 'antd'
import '../styles/loan.css';

function AllLoans() {
    const navigate = useNavigate();
    const id = 1;

    function goToDetails(event){
        navigate('/loan/' + id, {replace: true})
    }

    function goToForm(event){
        navigate('/create/loan/', {replace: true})

    }

    const columns = [
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
            render: (text) => <a>{text}</a>,
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

    return (
        <div className='home'>
            <div className='loan-header'>
                <div>Available Loans</div>
                <button className='loanbutton' onClick={goToForm}> + Create New Loan </button>
            </div>
            <Table
                columns= {columns}
                dataSource= {data}
                pagination={false}
                footer={() => ''}>
            </Table>
        </div>
    )
    }

    export default AllLoans;
