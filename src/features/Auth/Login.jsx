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
    Email: false,
    Password: false
  });

  const handleValidationChange = (fieldName, isValid) => {
    setLoginValidation(prev => ({ ...prev, [fieldName]: isValid }));
  };

  const validatePassword = (password) => {
    console.log("const validatePassword = (password)");
    const errors = [];
    if (errorLogin) {
      console.log("errorLogin - Неправильний email або пароль");
      errors.push("Неправильний email або пароль");
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
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        Email: Email,
        Password: Password,
      });

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("email", Email);
        sessionStorage.setItem("password", Password);

        const decoded = jwtDecode(response.data.token);
        axios
        .get(`http://localhost:4000/api/users/${decoded.id}/balance`)
        .then((response) => {
          const { Role } = response.data;
          if (Role === "Student") {
            navigate("/student/home");
          } else if (Role === "Teacher") {
            navigate("/teacher/home");
          }
        })
        //navigate("/student/home");
      } else {
        setErrorLogin(true);
      }
    } catch (error) {
      console.log("error");
      setErrorLogin(true);
    }
  };

  /* OAuth2 */

  const oAuthGoogleHandler = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  const oAuthFacebookHandler = () => {
   
     window.location.href = "http://localhost:4000/api/auth/facebook";
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
          onChange={handleEmailChange}
        />
        <PasswordInput
          placeholder={"Пароль"}
          value={Password}
          onChange={handlePasswordChange}
          validate={validatePassword}
          onValidationChange={handleValidationChange}
          onTrigger={errorLogin}
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
