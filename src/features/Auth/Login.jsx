import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StandartInput from "../../components/Inputs/StandartInput/StandartInput";
import PasswordInput from "../../components/Inputs/PasswordInput/PasswordInput";
import { PrimaryButton, SecondaryButton } from '../../components/Buttons/Buttons';
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedPassword = sessionStorage.getItem("password");

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  /* Validation */

  const [loginValidation, setLoginValidation] = useState({
    Email: true,
    Password: true
  });

  const handleValidationChange = (fieldName, isValid) => {
    setLoginValidation(prev => ({ ...prev, [fieldName]: isValid }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (errorLogin) {
      errors.push("Неправильний email або пароль");
    }
    return errors;
  };

  const validateEmail = async (email) => {
    const errors = [];
    if (!email) {
      errors.push("Це поле не може бути порожнім");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Некоректний email");
    }
    return errors;
  };

  /* Login/Register */

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorLogin(false);
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate("/auth/register");
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    navigate("/auth/forgot-password");
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!loginValidation.Email) {
      setErrorLogin(true);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/auth/login`, {
        Email: Email,
        Password: Password,
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
      });

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("email", Email);
        sessionStorage.setItem("password", Password);

        const decoded = jwtDecode(response.data.token);
        axios
          .get(`${process.env.REACT_APP_BASE_API_URL}/api/users/${decoded.id}/balance`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
          })
          .then((response) => {
            const { Role } = response.data;
            if (Role === "Student") {
              navigate("/student/home");
            } else if (Role === "Teacher") {
              navigate("/teacher/home");
            }
          });
      } else {
        setErrorLogin(true);
      }
    } catch (error) {
      setErrorLogin(true);
    }
  };

  /* OAuth2 */

  const oAuthGoogleHandler = () => {
    window.location.href = `${process.env.REACT_APP_BASE_API_URL}/api/auth/google`;
  };

  const oAuthFacebookHandler = () => {

    window.location.href = `${process.env.REACT_APP_BASE_API_URL}/api/auth/facebook`;
  };

  return (
    <div>
      <h2 className="login-title">Вхід</h2>

      <form className="login-form">
        <StandartInput
          type="email"
          name="Email"
          placeholder="Email"
          value={Email}
          validate={validateEmail}
          onChange={handleEmailChange}
          onValidationChange={handleValidationChange}
        />
        <PasswordInput
          placeholder={"Пароль"}
          value={Password}
          onChange={handlePasswordChange}
          validate={validatePassword}
          onValidationChange={handleValidationChange}
          onTrigger={errorLogin}
          validationNeeded={false}
        />

        <div className="login-forgot">
          <a className="cursor-pointer" onClick={handleForgotPasswordClick}>Забули пароль?</a>
        </div>

        <PrimaryButton onClick={handleLogIn}>Далі</PrimaryButton>
        <SecondaryButton onClick={handleRegisterClick}>Реєстрація</SecondaryButton>
      </form>

      <div className="login-divider">
        <div className="line"></div>
        <span>Або</span>
        <div className="line"></div>
      </div>

      <div className="login-socials" >
        <button className="social-button" onClick={oAuthGoogleHandler}>
          <img src="/assets/socialNetworkIcons/google.png" alt="Google" />
        </button>
        <button className="social-button">
          <img src="/assets/socialNetworkIcons/apple.png" alt="Apple" />
        </button>
        <button className="social-button" onClick={oAuthFacebookHandler}>
          <img src="/assets/socialNetworkIcons/facebook.png" alt="Facebook" />
        </button>
      </div>
    </div>
  );
};

export default Login;
