import React, {useEffect, useState}  from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Modal} from 'antd';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function MyLoan() {
    const navigate = useNavigate();
    const [listOfConfirmedLoansData, setListOfConfirmedLoansData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)
    const id = localStorage.getItem('username')
    const userPIN = JSON.parse(localStorage.getItem('pin'))

    function getTodayDate() {
        var date_arr = new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"}).split(',')[0].split('/').reverse()
        if (date_arr[1].length != 2) {  date_arr[1] = '0' + date_arr[1]}
        if (date_arr[2].length != 2) {  date_arr[2] = '0' + date_arr[2]}
        [date_arr[1], date_arr[2]] = [date_arr[2], date_arr[1]]
        return date_arr.join("-")
    }

    function goToDetails(event){
        const id = event.currentTarget.id;
        navigate('/myloan/' + id, {replace: true})
    }

    function makeRepayment(event){
        // send repayment calculation here
        console.log("Make repayment")
        const loan_request_id = event.currentTarget.id;
        // console.log(loan_request_id)
        const specific_loan_request = listOfConfirmedLoansData.filter(item => item['loan_request_id'] == loan_request_id)[0]
        // console.log(specific_loan_request)
        const data = {
            "userID": id,
            "PIN": userPIN,
            "OTP": "999999",
            "payer_accountID": specific_loan_request['borrower_account_num'],
            "payee_accountID": specific_loan_request['lender_account_num'],
            "loan_request_id": loan_request_id,
            "commission": specific_loan_request['monthly_installment'] * 0.01,
            "payment_amount": specific_loan_request['monthly_installment'],
            "payer_name": specific_loan_request["borrower_name"],
            "payer_nationality": specific_loan_request["borrower_nationality"],
            "payer_occupation": specific_loan_request["borrower_occupation"],
            "payer_type": specific_loan_request["borrower_type"],
            'payer_email': "",
            "payer_phone": ""
        };
        console.log(data)
        const makePaymentURL = "http://localhost:5300/make_payment"
        const req = fetch(
            makePaymentURL,
            {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(data)
            }
        )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            getConfirmedLoans()
            setModalOpen(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    // To fill Confirmed Loans Table

    function getConfirmedLoans() {
        const getConfirmedLoansURL = "http://localhost:5006/loanrequest/getall"
        const req = fetch(
            getConfirmedLoansURL
        )
        .then( (response) => response.json())
        .then( (data) => {
            const tableData = []
            const allData = data['data']['loan_requests']
            console.log(allData)
            allData.forEach( (data)  => {
                if (data['status'] == "active" & (data['borrower_id'] == id || data['lender_id'] == id)) {
                    data['isLender'] = data['lender_id'] == id ? true : false
                    tableData.push(data);
                }
            })
            // console.log(tableData)
            console.log(listOfConfirmedLoansData)
            if (JSON.stringify(tableData) !=  JSON.stringify(listOfConfirmedLoansData)) {
                setListOfConfirmedLoansData(tableData);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getConfirmedLoans()
    },listOfConfirmedLoansData)

    //     {
    //         title: 'Loan ID',
    //         dataIndex: 'loanId',
    //         key: 'loanId',
    //         align: 'center',
    //         render: (text) => <span className='font-normal'>{text}</span>
    //     },
    //     {
    //         title: 'Name',
    //         dataIndex: 'name',
    //         key: 'name',
    //         align: 'center',
    //         render: (text) => <span>{text}</span>,
    //     },
    //     {
    //         title: 'Loan Amount',
    //         dataIndex: 'loanAmt',
    //         key: 'loanAmt',
    //         align: 'center',
    //         render: (text) => <span className='font-normal'>{text}</span>
    //     },
    //     {
    //         title: 'Loan Terms',
    //         key: 'loanTerms',
    //         dataIndex: 'loanTerms',
    //         align: 'center',
    //         render: (text) => <span className='font-normal'>{text}</span>
    //     },
    //     {
    //         title: 'Info',
    //         key: 'action',
    //         align: 'center',
    //         render: (text, record, index) => (
    //             <a id={record.loanId} onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
    //         )
    //     },
    //     {
    //         title: 'Accept/Deny',
    //         key: 'action',
    //         align: 'center',
    //         render: (text) => (
    //             <div className='flex around place-content-center'>
    //                 <CheckCircleIcon className='text-green-500 w-14' onClick={() => {acceptLoanOffer()}}></CheckCircleIcon>
    //                 <XCircleIcon className="text-red-500 w-14" onClick={() => {denyLoanOffer()}}></XCircleIcon>
    //             </div>
    //         )
    //     }
    //     ];

    const columns_confirmed_loans = [
        {
            title: 'Loan ID',
            dataIndex: 'loan_request_id',
            key: 'loan_request_id',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Name',
            // dataIndex: 'borrower_name',
            key: 'borrower_name',
            align: 'center',
            render: (text, record) => <span>{record['isLender'] ? record['borrower_name'] : record['lender_name'] }</span>,
        },
        {
            title: 'Loan Amount',
            dataIndex: 'principal',
            key: 'principal',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        // {
        //     title: 'Loan Terms',
        //     key: 'loan_term',
        //     dataIndex: 'loan_term',
        //     align: 'center',
        //     render: (text) => <span className='font-normal'>{text}</span>
        // },
        {
            title: 'Info',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <a id={record.loan_request_id} onClick={goToDetails} className="rounded-full bg-sky-400 p-4 text-white">Details</a>
            )
        },
        {
            title: 'Repayment Amount',
            key: 'monthly_installment',
            dataIndex: 'monthly_installment',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Next Repayment Date',
            key: 'date_of_next_repayment',
            dataIndex: 'date_of_next_repayment',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Amount Left to Pay',
            key: 'amount_left',
            dataIndex: 'amount_left',
            align: 'center',
            render: (text) => <span className='font-normal'>{text}</span>
        },
        {
            title: 'Repayment',
            key: 'action',
            dataIndex: 'isLender',
            align: 'center',
            render: (text, record) => (
                <button 
                hidden={text}
                disabled={record.date_of_next_repayment != getTodayDate()}
                id={record.loan_request_id}
                onClick={makeRepayment}
                className='bg-green-500	rounded-full p-4 px-7 disabled:opacity-75 disabled:bg-slate-500	disabled:text-white'>Pay</button>
            )
        }
        ];

    return (
        <div className='home'>
            <div className='mb-10'>My Loans</div>
            <div className='text-lg mb-2'>Confirmed Loans</div>
            <Table
                columns= {columns_confirmed_loans}
                dataSource= {listOfConfirmedLoansData}
                pagination={false}
                footer={() => ''}>
            </Table>
            <Modal
                style={{
                    top: 200,
                }}
                open={modalOpen}
                onOk={() => setModalOpen(false)}
            >
                
                <p className='m-auto w-screen'><p className='text-lg font-bold'>PAYMENT SUCCESSFUL</p><CheckCircleIcon className='text-green-500 w-48'></CheckCircleIcon></p>
            </Modal>
            
        </div>
    )
    }

    export default MyLoan;
