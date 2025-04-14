import React from "react";
import './TaskButton.css';
const TaskButton = ({ text, icon, count, isSelected, onClick }) => {
    return (
    
      <div className="taskButton relative">
     <button
      className={`nav-button px-4 py-2 rounded-3xl border flex items-center gap-2 transition-colors ${
        isSelected ? 'select-button' : ''
      }`}
      onClick={onClick}
    >
      <div data-svg-wrapper>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      <div className={`text-base font-bold font-['Nunito'] ${isSelected ? 'text-white' : ''}`}>
        {text}
      </div>
      {count > 0 && (
        <div className={`${isSelected ? '' : 'button-invisible'}`}>
          <div className="w-5 h-5 absolute -top-1 right-2 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
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