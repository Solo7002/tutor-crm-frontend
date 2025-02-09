import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="pattern-image">
      </div>

      <div className="login-wrapper">
        {/* Фиолетовая часть */}
        <div className="login-left">
          <div className="center-vertival-wave">
            <svg width="40" height="630" viewBox="0 0 40 630" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M-0.00147394 630L439.998 630C451.043 630 459.998 621.046 459.998 610V20C459.998 8.95431 451.044 0 439.998 0H-0.00147394C-0.00147394 0 36.682 59.815 36.8351 104.514C36.9122 127.037 27.6645 142.147 18.4168 157.257C9.16909 172.367 -0.0786071 187.477 -0.00147394 210C0.0750642 232.349 9.24593 247.303 18.4168 262.257C27.5877 277.211 36.7585 292.164 36.8351 314.514C36.9122 337.037 27.6645 352.147 18.4168 367.257C9.16909 382.367 -0.0786071 397.477 -0.00147394 420C0.0750641 442.349 9.24593 457.303 18.4168 472.257C27.5877 487.211 36.7585 502.164 36.8351 524.514C36.9893 569.56 26.7647 593.837 -0.00147394 630Z" fill="white" />
            </svg>
          </div>

          <div className="center-horizontal-wave">
            <svg width="440" height="60" viewBox="0 0 440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M76 0.011542C43.857 -0.698854 0 31.6201 0 31.6201V738H440V31.6201C440 31.6201 396.786 -0.540988 365 0.011542C334.469 0.542266 324.034 31.3116 293.5 31.6201C262.25 31.9358 251.251 -0.144497 220 0.011542C189.107 0.165792 178.393 31.778 147.5 31.6201C116.964 31.464 106.529 0.686257 76 0.011542Z" fill="white" />
            </svg>
          </div>

          <div className="logo-img-cont">
            <img src="/assets/dark_logo.png" alt="Logo" className="login-logo" />
          </div>
          <p className="login-text">
            Керуйте навчальним процесом легко: від розкладу до управління матеріалами – усе під рукою.
          </p>

          <div className="teacher-img-cont">
            <img src="/assets/login/girl.png" alt="Illustration" className="teacher-image" />
          </div>
        </div>



        {/* Белая часть */}
        <div className="login-right">
          <h2 className="login-title">Вхід</h2>

          <div className="centered-login-div">
            <form className="login-form">
              <input type="email" placeholder="Email" className="login-input" />
              <input type="password" placeholder="Пароль" className="login-input" />

              <div className="login-forgot">
                <a href="#">Забули пароль?</a>
              </div>

              <button className="login-button">Далі</button>
              <button className="register-button">Реєстрація</button>
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
        </div>
      </div>
    </div>
  );
};

export default Login;