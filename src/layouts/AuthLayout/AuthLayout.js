import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

const AuthLayout = () => {
  return (
    <div className="login-container">
      <div className="pattern-image"></div>

      <div className="login-wrapper">
        <div className="login-left">
          <div className="center-vertival-wave">
            <svg width="40" height="630" viewBox="0 0 40 630" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M-0.00147394 630L439.998 630C451.043 630 459.998 621.046 459.998 610V20C459.998 8.95431 451.044 0 439.998 0H-0.00147394C-0.00147394 0 36.682 59.815 36.8351 104.514C36.9122 127.037 27.6645 142.147 18.4168 157.257C9.16909 172.367 -0.0786071 187.477 -0.00147394 210C0.0750642 232.349 9.24593 247.303 18.4168 262.257C27.5877 277.211 36.7585 292.164 36.8351 314.514C36.9122 337.037 27.6645 352.147 18.4168 367.257C9.16909 382.367 -0.0786071 397.477 -0.00147394 420C0.0750641 442.349 9.24593 457.303 18.4168 472.257C27.5877 487.211 36.7585 502.164 36.8351 524.514C36.9893 569.56 26.7647 593.837 -0.00147394 630Z" fill="white" />
            </svg>
          </div>

          <div className="center-horizontal-wave">
            {/* <svg width="440" height="60" viewBox="0 0 440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M76 0.011542C43.857 -0.698854 0 31.6201 0 31.6201V738H440V31.6201C440 31.6201 396.786 -0.540988 365 0.011542C334.469 0.542266 324.034 31.3116 293.5 31.6201C262.25 31.9358 251.251 -0.144497 220 0.011542C189.107 0.165792 178.393 31.778 147.5 31.6201C116.964 31.464 106.529 0.686257 76 0.011542Z" fill="white" />
            </svg> */}
            <svg width="760" height="60" viewBox="0 0 760 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M54.0284 4.25934C31.0301 4.32511 0 32.5 0 32.5V237H760V31.9279C760 31.9279 729.417 0.000117467 705.714 0.000117467C682.012 0.000117467 675.131 31.9279 651.429 31.9279C627.726 31.9279 620.845 -0.0707283 597.143 0.000117467C573.344 0.0712528 566.649 31.8866 542.857 32.4746C519.793 33.0447 511.686 4.25934 488.614 4.25934C465.543 4.25934 457.443 32.4418 434.372 32.4746C411.223 32.5076 403.062 4.18944 379.914 4.25934C356.916 4.32878 348.884 32.4016 325.886 32.5C302.657 32.5993 294.443 4.19334 271.214 4.25934C248.139 4.3249 240.047 32.5 216.971 32.5C193.896 32.5 185.804 4.25934 162.729 4.25934C139.653 4.25933 131.561 32.4671 108.486 32.5C85.3336 32.533 77.1805 4.19312 54.0284 4.25934Z" fill="white" />
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
        <div className="login-right">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;