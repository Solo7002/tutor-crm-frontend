import React from "react";
import './TaskButton.css';
const TaskButton = ({ text, icon, count, isSelected, onClick }) => {
  return (
    <div className="taskButton relative">
      <button
        className={`nav-button px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-2xl sm:rounded-3xl border flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base ${isSelected ? 'select-button' : ''
          }`}
        onClick={onClick}
      >
        <div data-svg-wrapper>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sm:w-6 sm:h-6"
          >
            <path
              d={icon}
              stroke=""
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={`text-sm sm:text-base font-bold font-['Nunito'] ${isSelected ? 'text-white' : ''}`}>
          {text}
        </div>
        {count > 0 && (
          <div className={`${isSelected ? '' : 'button-invisible'}`}>
            <div className="w-4 h-4 sm:w-5 sm:h-5 absolute -top-1 right-1 sm:right-2 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold font-['Nunito']">
                {count}
              </span>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default TaskButton;