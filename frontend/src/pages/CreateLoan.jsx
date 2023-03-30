import React from 'react';
import { useNavigate } from 'react-router-dom';
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

    const onFinish = (values) => {
        console.log(values);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
          <Select
            style={{
              width: 70,
            }}
          >
            <Option value="USD">USD</Option>
            <Option value="SGD">SGD</Option>
          </Select>
        </Form.Item>
      );

      const suffixSelector = (
        <Form.Item name="suffix" noStyle>
          <Select
            style={{
              width: 100,
            }}
          >
            <Option value="months">months</Option>
            <Option value="years">years</Option>

          </Select>
        </Form.Item>
      );

    return (
        <div className='home '>
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
                        {/* <Form.Item name="term" label="Loan Term" rules={[{required: true,},]}>
                            <Input />
                        </Form.Item> */}

                        <Form.Item name="range-picker" label="Loan Period" rules={[{required: true,},]}>
                            <RangePicker className='w-full'  />
                        </Form.Item>

                        <Form.Item name="amount" label="Loan Amount" rules={[{required: true,},]}>
                            <InputNumber addonBefore={prefixSelector} className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="interest" label="Interest Rate" rules={[{required: true,},]}>
                            <InputNumber addonAfter="%" className='w-1/5' />
                        </Form.Item>

                        <Form.Item name="repayment" label="Repayment Period" rules={[{required: true,},]}>
                            <InputNumber addonAfter={"months"} className='w-2/5' />
                        </Form.Item>

                        <Form.Item name="purpose" label="Loan Purpose" rules={[{required: true,},]}>
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
