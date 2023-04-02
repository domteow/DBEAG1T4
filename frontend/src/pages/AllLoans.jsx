import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Spin} from 'antd'
import '../styles/loan.css';

function AllLoans() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllLoansURL = "http://localhost:5400/view_all_loan_request"
        const req = fetch(
            getAllLoansURL
        )
        .then((response) => response.json())
        .then((data) => {
            const tableData = []
            const allData = data['data']['all_loan_requests']
            allData.forEach((data)  => {
                const loanData = {
                    loanId: data["loan_request_id"],
                    name: data["borrower_name"],
                    loanAmt: data["principal"],
                    loanTerms: data["loanTerm"]
                }
                tableData.push(loanData);
            })

            setData(tableData);
            setLoading(false);
            console.log(tableData)
        })
        .catch((error) => {
            console.log(error)
        })
    },data)

    function goToDetails(event){
        const id = event.currentTarget.id
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
            render: (text, record,index) => (
                <a id={record.loanId} onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
            )
        },
        ];


    return (
        <div className='home'>
            <div className='loan-header'>
                <div>Available Loans</div>
                <button className='loanbutton' onClick={goToForm}> + Create New Loan </button>
            </div>
            { loading === true ? <Spin style={{"width":"1000px","margin":"auto", "color": "white"}} tip="Loading"></Spin> : 
            <Table
                columns= {columns}
                dataSource= {data}
                pagination={false}
                footer={() => ''}>
            </Table>}
        </div>
    )
    }

    export default AllLoans;
