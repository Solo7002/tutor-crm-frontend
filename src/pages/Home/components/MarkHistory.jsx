import React from "react";
import "../HomeStudent.css";

const MarkHistory = ({ grades }) => {
  const getIcon = (type) => {
    switch (type) {
      case "Test": // Test
        return (
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.375 6.75H22.5M12.375 13.5H22.5M13.5 20.25H22.5M4.5 18C4.5 17.4033 4.73705 16.831 5.15901 16.409C5.58097 15.9871 6.15326 15.75 6.75 15.75C7.34674 15.75 7.91903 15.9871 8.34099 16.409C8.76295 16.831 9 17.4033 9 18C9 18.6649 8.4375 19.125 7.875 19.6875L4.5 22.5H9M6.75 11.25V4.5L4.5 6.75" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "Homework": // Homework
        return (
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.125 4.5V24.75M14.625 9H16.875M14.625 13.5H16.875M6.75 4.5H19.125C19.7217 4.5 20.294 4.73705 20.716 5.15901C21.1379 5.58097 21.375 6.15326 21.375 6.75V20.25C21.375 20.8467 21.1379 21.419 20.716 21.841C20.294 22.2629 19.7217 22.5 19.125 22.5H6.75C6.45163 22.5 6.16548 22.3815 5.95451 22.1705C5.74353 21.9595 5.625 21.6734 5.625 21.375V5.625C5.625 5.32663 5.74353 5.04048 5.95451 4.82951C6.16548 4.61853 6.45163 4.5 6.75 4.5Z" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "Classwork": // Classwork
        return (
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.375 13.5C3.375 14.8296 3.63689 16.1462 4.14572 17.3747C4.65455 18.6031 5.40035 19.7193 6.34054 20.6595C7.28074 21.5996 8.39691 22.3455 9.62533 22.8543C10.8538 23.3631 12.1704 23.625 13.5 23.625C14.8296 23.625 16.1462 23.3631 17.3747 22.8543C18.6031 22.3455 19.7193 21.5996 20.6595 20.6595C21.5996 19.7193 22.3455 18.6031 22.8543 17.3747C23.3631 16.1462 23.625 14.8296 23.625 13.5C23.625 12.1704 23.3631 10.8538 22.8543 9.62533C22.3455 8.39691 21.5996 7.28074 20.6595 6.34054C19.7193 5.40035 18.6031 4.65455 17.3747 4.14572C16.1462 3.63689 14.8296 3.375 13.5 3.375C12.1704 3.375 10.8538 3.63689 9.62533 4.14572C8.39691 4.65455 7.28074 5.40035 6.34054 6.34054C5.40035 7.28074 4.65455 8.39691 4.14572 9.62533C3.63689 10.8538 3.375 12.1704 3.375 13.5Z" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.25 18.5625L13.5 15.1875M13.5 15.1875L15.75 18.5625M13.5 15.1875V12.9375M13.5 12.9375L16.875 11.8125M13.5 12.9375L10.125 11.8125" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 9C13.8107 9 14.0625 8.74816 14.0625 8.4375C14.0625 8.12684 13.8107 7.875 13.5 7.875C13.1893 7.875 12.9375 8.12684 12.9375 8.4375C12.9375 8.74816 13.1893 9 13.5 9Z" fill="#8A48E6" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeUkr = (type) => {
    switch (type) {
      case "Classwork":
        return "Робота в класі";
      case "Homework":
        return "Домашнє завдання";
      case "Test":
        return "Тест";
      default:
        return "Домашнє завдання";
    }
  }

  const getBgMark = (grade) => {
    switch (grade) {
      case 9:
        return "#CAC2FC";
      case 10:
        return "#C4EAFA";
      case 12:
        return "#E0C8FF";
      default:
        return "#E0C8FF";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg mb-6 shadow-md h-[30vh] overflow-y-auto "> {/*no-scrollbar*/}
      <h2
        className="text-lg font-semibold"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          fontSize: "20pt",
          lineHeight: "32.74pt",
          letterSpacing: "-0.5%",
          color: "#120C38",
        }}
      >
        Історія оцінок
      </h2>
      <ul className="mt-4 custom-scrollbar">
        {grades.map((grade, index) => (
          <li key={index} className="mb-2 flex items-center">
            {/* Icon */}
            <div className="mr-4">{getIcon(grade.type)}</div>
            {/* Content */}
            <div>
              <div className="text-[#6f6f6f] text-[10pt] font-normal font-['Mulish']">{grade.date}</div>
              <div className="text-black text-[14pt] font-semibold font-['Segoe UI']">{grade.subject}</div>
              <div className="text-[#6f6f6f] text-[10pt] font-normal font-['Mulish']">{getTypeUkr(grade.type)}</div>
            </div>
            {/* Grade Circle */}
            <div className="ml-auto w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: getBgMark(grade.grade) }}>
              <div className="text-center text-white text-[15px] font-semibold font-['Segoe UI']">{grade.grade}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarkHistory;