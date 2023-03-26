import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Space} from 'antd'

function AllLoans() {
    const navigate = useNavigate();
    const id = 1;

    function goToDetails(event){
        navigate('/loan/' + id, {replace: true})
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
            title: '',
            key: 'action',
            align: 'center',
            render: (text) => (
                <a onClick={goToDetails}>Click to know more</a>
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
            <div className='mb-10'>Loan Requests</div>
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
