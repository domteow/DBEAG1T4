import React, {useEffect, useState}  from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, Space} from 'antd';
import {CheckCircleIcon} from '@heroicons/react/20/solid';
import {XCircleIcon} from '@heroicons/react/20/solid';

function MyLoan() {
    const navigate = useNavigate();
    const [listOfLendersData, setListOfLendersData] = useState([]);
    const [listOfConfirmedLoansData, setListOfConfirmedLoansData] = useState([]);
    const [loading, setLoading] = useState(true);
    const id = "domteow";

    function goToDetails(event){
        const id = event.currentTarget.id;
        navigate('/myloan/' + id, {replace: true})
    }
    function makeRepayment(event){
        // send repayment calculation here
        console.log("Make repayment")
        console.log(event)
    }
    // function acceptLoanOffer(event){
    //     // after accepting loanOffer
    //     console.log("make transfer of loan here")
    //     // Remove all other loanOffers from different lenders and notify them
    //     // Remove THIS loanOffer and notify lender of successful loan + payment of loan
    //     // Make initial payment from lender to borrower
    // }
    // function denyLoanOffer(event){
    //     //  after rejecting loanOffer
    //     console.log("remove and notify of rejection")
    //     // Remove THIS loanOffer and notify the lender of the rejection
    // }
    // To fill List of Lenders Table
    // useEffect(() => {

    //     const getAllLoanOffersURL = "http://localhost:5007/loanoffer/getallborrowerid/" + id
    //     const req = fetch(
    //         getAllLoanOffersURL
    //     )
    //     .then( (response) => response.json())
    //     .then(async (data) => {
    //         const tableData = []
    //         const allData = data['data']['loan_offerss']
    //         await allData.forEach(async (data)  => {
    //             const getLoanInfo = "http://localhost:5006/loanrequest/get/" + data['loan_request_id']
    //             const req1 = await fetch(
    //                 getLoanInfo
    //             )
    //             .then( async (response) => await response.json())
    //             .then(async (data2) =>  {
    //                 // console.log(data2['data'])
    //                 const loanData = {
    //                     // get information of LENDER (person lending the money)
    
    //                     // ID of the loan
    //                     loanId: data["loan_request_id"],
    //                     // Name of LENDER
    //                     name: data["lender_id"],
    //                     loanAmt: data2['data']["principal"],
    //                     loanTerms: data2['data']["loanTerm"]
    //                 }

    //                 if (!tableData.includes(loanData)) {
    //                     tableData.push(loanData)
    //                     // setListOfLendersData(oldArr => [...oldArr,loanData])
    //                 }
    //                 // tableData.push(loanData);
    //             })
    //             ifone:
    //                 if (tableData.length == allData.length) {
    //                     console.log(tableData)
    //                     if (JSON.stringify(tableData) == JSON.stringify(listOfLendersData)) {
    //                         break ifone
    //                     }
    //                     setListOfLendersData(tableData);
    //                     setLoading(false);
    //                 }
    //             // setListOfLendersData(tableData);
    //             // setLoading(false);
                
    //         })
    //         // console.log(tableData)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // },listOfLendersData)

    // To fill Confirmed Loans Table
    useEffect(() => {

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
                    // const loanData = {
                    //     loanId: data["loan_request_id"],
                    //     name: data["borrower_name"],
                    //     loanAmt: data["principal"],
                    //     loanTerms: data["loanTerm"],
                    //     isLender: data['lender_id'] == id ? true : false,
                    // }
                    tableData.push(data);
                }
            })
            // console.log(tableData)
            console.log(listOfConfirmedLoansData)
            if (JSON.stringify(tableData) !=  JSON.stringify(listOfConfirmedLoansData)) {
                setListOfConfirmedLoansData(tableData);
                setLoading(false);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    },listOfConfirmedLoansData)


    // const columns_list_of_lenders = [
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
            {
                title: 'Loan Terms',
                key: 'loan_term',
                dataIndex: 'loan_term',
                align: 'center',
                render: (text) => <span className='font-normal'>{text}</span>
            },
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
            // {Change Pay visibility, person==loaner, show repayment button}
            {
                title: 'Repayment',
                key: 'action',
                dataIndex: 'isLender',
                align: 'center',
                render: (text) => (
                    <button 
                    hidden={text}
                    onClick={makeRepayment}
                    className='bg-green-500	rounded-full p-4 px-7'>Pay</button>
                )
            }
            ];

    return (
        <div className='home'>
            <div className='mb-10'>My Loans</div>
            {/* {If person==borrower, show table "List of Lenders"} */}
            {/* <div className='text-lg mb-2'>List of Lenders</div>
            <Table
                columns= {columns_list_of_lenders}
                dataSource= {listOfLendersData}
                pagination={false}
                footer={() => ''}>
            </Table>
            <br></br> */}
            <div className='text-lg mb-2'>Confirmed Loans</div>
            <Table
                columns= {columns_confirmed_loans}
                dataSource= {listOfConfirmedLoansData}
                pagination={false}
                footer={() => ''}>
            </Table>
        </div>
    )
    }

    export default MyLoan;
