import React from "react";
import "../styles/LoginStyles.css";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import DoctorLogin from "../assets/doctor-login.png";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //handle form
  const onFinishHandler = async (val) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", val);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <div className="container animated-content">
        <img src={DoctorLogin} />
        <h3>
          Your path to wellness starts here – book your appointment today!
        </h3>
        <p>
          Simplify your path to wellness with our intuitive booking platform.
          Ditch the stress of scheduling and prioritize your health journey
          effortlessly. Book now and embrace a brighter, healthier future!
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinishHandler} className="login-form">
        <h3 className="text-center">Login</h3>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>
        <Link to="/register" className="m-2">
          Click here to Register
        </Link>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
