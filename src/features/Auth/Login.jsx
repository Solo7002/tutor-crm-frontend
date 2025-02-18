import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StandartInput from "../../components/Inputs/StandartInput/StandartInput";
import PasswordInput from "../../components/Inputs/PasswordInput/PasswordInput";
import { PrimaryButton, SecondaryButton } from '../../components/Buttons/Buttons';
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedPassword = sessionStorage.getItem("password");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate("/auth/register");
  };

  const handleEmailChange = (em) => {
    setEmail(em);
  }

  const handlePasswordChange = (pass) => {
    setPassword(pass);
  };

  const handleLogIn = () =>{
    
  }

  return (
    <div>
      <h2 className="login-title">Вхід</h2>

      <form className="login-form">
        <StandartInput
          type="email"
          name="Email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <PasswordInput placeholder={"Пароль"} value={password} onChange={handlePasswordChange} />

        <div className="login-forgot">
          <a href="/forgot-password">Забули пароль?</a>
        </div>

        <PrimaryButton onClick={handleLogIn}>Далі</PrimaryButton>
        <SecondaryButton onClick={handleRegisterClick}>Реєстрація</SecondaryButton>
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
