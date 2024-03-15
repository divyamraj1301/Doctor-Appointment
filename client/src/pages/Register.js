import React from "react";
import "../styles/RegisterStyles.css";
import DoctorRegister from "../assets/DoctorRegister.png";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //handle form
  const onFinishHandler = async (val) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", val);
      dispatch(hideLoading());
      if (res.data.success) {
        alert("Registered Successfully");
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      alert("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onFinishHandler}
        className="register-form"
      >
        <h3 className="text-center">Register</h3>
        <Form.Item label="Name" name="name">
          <Input type="text" required />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>
        <Link to="/login" className="m-2">
          Click here to login
        </Link>
        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </Form>
      <div className="container animated-content">
        <img src={DoctorRegister} />
        <h4>
          Elevate Your Healthcare Experience: Secure Premier Medical Expertise
          by Registering Today!
        </h4>
      </div>
    </div>
  );
};

export default Register;
