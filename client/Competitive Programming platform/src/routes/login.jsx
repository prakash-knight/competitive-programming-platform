import { useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Layout from "../ui/Layout";
import { FiCode } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const [ep, setUser] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    let fname = event.target.name;
    let fvalue = event.target.value;

    setUser((currData) => {
      return {
        ...currData,
        [fname]: fvalue,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      let res = await axios.post(
        "http://localhost:3000/auth/login",
        ep
      );

      console.log(res.data.user.userid);

      localStorage.setItem("userid", res.data.user.userid);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMessage(res.data.message);
      navigate(`/user/${res.data.user.userid}`);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  }

  const isError = message && (
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("wrong") ||
    message.toLowerCase().includes("error") ||
    message.toLowerCase().includes("not found")
  );

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FiCode />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to track your competitive programming progress</p>
          </div>

          {message && (
            <div className={`auth-message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to='/signup'>Create Account</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}