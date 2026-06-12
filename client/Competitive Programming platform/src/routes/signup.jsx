import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../ui/Layout";
import { Link } from "react-router-dom";
import { FiCode } from "react-icons/fi";
import { API_BASE_URL } from "../config";

export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userid: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const fname = event.target.name;
    const fvalue = event.target.value;

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
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        user
      );

      console.log(response.data);
      if (response.data.user?.userid) {
        localStorage.setItem("userid", response.data.user.userid);
      }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setMessage(response.data.message || "Signup Successful");
      navigate(`/user/${response.data.user.userid}`);
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
    message.toLowerCase().includes("exists") ||
    message.toLowerCase().includes("failed")
  );

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <FiCode />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us to start tracking and improving your coding skills</p>
          </div>

          {message && (
            <div className={`auth-message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="username-input">Username</label>
              <input
                id="username-input"
                type="text"
                name="userid"
                placeholder="codemaster99"
                value={user.userid}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={user.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={user.password}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to='/login'>Sign In</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}