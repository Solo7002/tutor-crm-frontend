import React from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate("/auth/register");
  };

  const handlePasswordChange = (e) => {
    console.log("Password:", e.target.value);
  };


  return (
    <div>
      <h2 className="login-title">Вхід</h2>

      <form className="login-form">
        <input type="email" placeholder="Email" className="login-input" />
        <PasswordInput placeholder={"Пароль"} onChange={handlePasswordChange} />

        <div className="login-forgot">
          <a href="/forgot-password">Забули пароль?</a>
        </div>

        <button className="login-button">Далі</button>
        <button className="register-button" onClick={handleRegisterClick}>Реєстрація</button>
      </form>

      <div className="login-divider">
        <div className="line"></div>
        <span>Або</span>
        <div className="line"></div>
      </div>

      <div className="login-socials">
        <button className="social-button">
          <img src="/assets/socialNetworkIcons/google.png" alt="Google" />
        </button>
        <button className="social-button">
          <img src="/assets/socialNetworkIcons/apple.png" alt="Apple" />
        </button>
        <button className="social-button">
          <img src="/assets/socialNetworkIcons/facebook.png" alt="Facebook" />
        </button>
      </div>
    </div>
  );
};

export default Login;
