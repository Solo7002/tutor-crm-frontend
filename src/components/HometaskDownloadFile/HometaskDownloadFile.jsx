import React from "react";
import "./HometaskDownloadFile.css"
const HometaskDownloadFile = ({ title, format, fileLink }) => {
  return (
    <div className="book-card">
      <div data-svg-wrapper>
        <svg
          width="40"
          height="41"
          viewBox="0 0 40 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="book-icon"
        >
          <path
            d="M23.3333 5.5V12.1667C23.3333 12.6087 23.5089 13.0326 23.8215 13.3452C24.1341 13.6577 24.558 13.8333 25 13.8333H31.6667"
            stroke="#827FAE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28.3333 35.5H11.6667C10.7826 35.5 9.93476 35.1488 9.30964 34.5237C8.68452 33.8986 8.33333 33.0507 8.33333 32.1667V8.83333C8.33333 7.94928 8.68452 7.10143 9.30964 6.47631C9.93476 5.85119 10.7826 5.5 11.6667 5.5H23.3333L31.6667 13.8333V32.1667C31.6667 33.0507 31.3155 33.8986 30.6904 34.5237C30.0652 35.1488 29.2174 35.5 28.3333 35.5Z"
            stroke="#827FAE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="book-info">
        <div className="book-title">{title}</div>
        <div className="book-format">{format}</div>
      </div>
      <a href={fileLink} target="_blank" rel="noopener noreferrer">
        <div class="download-icon">
          <svg
            width="40"
            height="41"
            viewBox="0 0 40 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="download-icon"
          >
            <rect x="0.5" y="1" width="39" height="39" rx="19.5" fill="white" />
            <rect x="0.5" y="1" width="39" height="39" rx="19.5" stroke="white" />
            <path
              d="M12 25.5V27.5C12 28.0304 12.2107 28.5391 12.5858 28.9142C12.9609 29.2893 13.4696 29.5 14 29.5H26C26.5304 29.5 27.0391 29.2893 27.4142 28.9142C27.7893 28.5391 28 28.0304 28 27.5V25.5M15 19.5L20 24.5M20 24.5L25 19.5M20 24.5V12.5"
              stroke="#8A48E6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>
    </div>
  );
};
export default HometaskDownloadFile;