import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Фиолетовая часть */}
        <div className="login-left">
          <img src="/placeholder-logo.png" alt="Logo" className="login-logo" />
          <p className="login-text">
            Керуйте навчальним процесом легко: від розкладу до управління матеріалами – усе під рукою.
          </p>
          <img src="/placeholder-teacher.png" alt="Illustration" className="login-image" />
        </div>

        {/* Белая часть */}
        <div className="login-right">
          <h2 className="login-title">Вхід</h2>

          <form className="login-form">
            <input type="email" placeholder="Email" className="login-input" />
            <input type="password" placeholder="Пароль" className="login-input" />

            <div className="login-forgot">
              <a href="#">Забули пароль?</a>
            </div>

            <button className="login-button">Далі</button>
            <button className="register-button">Реєстрація</button>

            <button className="test-btn">Button</button>
          </form>

          <div className="login-divider">
            <div className="line"></div>
            <span>Або</span>
            <div className="line"></div>
          </div>

          <div className="login-socials">
            <button className="social-button">
              <img src="/placeholder-google.png" alt="Google" />
            </button>
            <button className="social-button">
              <img src="/placeholder-apple.png" alt="Apple" />
            </button>
            <button className="social-button">
              <img src="/placeholder-facebook.png" alt="Facebook" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;