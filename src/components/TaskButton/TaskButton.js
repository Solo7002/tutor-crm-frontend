import React from "react";
import './TaskButton.css';
const TaskButton = ({ text, icon, count, isSelected, onClick }) => {
    return (
    
      <div className="taskButton">
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
        <div className={`w-4 h-4 relative ${isSelected ? '' : 'button-invisible'}`}>
          <div className="w-4 h-4 absolute bg-violet-600 rounded-full top-[-14px] left-[9px] border-2 border-white" />
          <div className="w-3.5 h-3.5 absolute text-center text-white text-xs top-[-15px] left-[10px] font-bold font-['Nunito']">
            {count}
          </div>
        </div>
      )}
    </button>
      </div>
    );
  };
  
  export default TaskButton;
  