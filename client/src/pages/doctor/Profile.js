import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Input, TimePicker } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice';
import moment from 'moment';

const Profile = () => {

    const { user } = useSelector(state => state.user);
    const [doctor, setDoctor] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const handleFinish = async (val) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/updateProfile', {
                ...val, userId: user._id, timings: [
                    moment(val.timings[0]).format("HH:mm"),
                    moment(val.timings[1]).format("HH:mm")
                ],
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
            dispatch(hideLoading());
            if (res.data.success) {
                alert(`Successfully Updated`);
                navigate('/');
            }
            else {
                alert('Unexpected error occured');
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            alert('Something went wrong');
        }
    }

    const getDoctorInfo = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorInfo', { userId: params.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDoctorInfo();
    }, []);

    return (
        <Layout>
            <h1>Manage Profile</h1>
            {
                doctor && (
                    <Form layout='vertical' onFinish={handleFinish} className='m-5' initialValues={{
                        ...doctor,
                        timings: [
                            moment(doctor.timings[0], 'HH:mm'),
                            moment(doctor.timings[1], 'HH:mm'),
                        ]
                    }}>

                        <Row gutter={25}>
                            <Col xs={24} md={24} lg={12}>
                                <h3 className="">Personal Details</h3>
                                <Form.Item label='First Name' name='firstName' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your First Name' />
                                </Form.Item>

                                <Form.Item label='Last Name' name='lastName' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Last Name' />
                                </Form.Item>

                                <Form.Item label='Phone No.' name='phone' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Phone No.' />
                                </Form.Item>

                                <Form.Item label='Email' name='email' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Email' />
                                </Form.Item>

                                <Form.Item label='Website' name='website'>
                                    <Input type='text' placeholder='Your Website' />
                                </Form.Item>

                                <Form.Item label='Address' name='address' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Address' />
                                </Form.Item>

                            </Col>

                            <Col xs={20} md={24} lg={12}>
                                <h3 className="">Professional Details</h3>
                                <Form.Item label='Specialisation' name='specialisation' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Specialisation' />
                                </Form.Item>

                                <Form.Item label='Experience' name='experience' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Experience' />
                                </Form.Item>

                                <Form.Item label='Fees Per Consultation' name='feesPerConsultation' required rules={[{ required: true }]}>
                                    <Input type='text' placeholder='Your Fees' />
                                </Form.Item>

                                <Form.Item label='Timings' name='timings' required >
                                    <TimePicker.RangePicker format="HH:mm" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={8}></Col>
                            <Col xs={24} md={24} lg={8}>
                                <button className="btn btn-primary form-btn" type='Submit'>
                                    Update
                                </button>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        </Layout>
    )
}

export default Profile