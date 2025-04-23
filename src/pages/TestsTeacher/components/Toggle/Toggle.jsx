import React from 'react';

const Toggle = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-10 h-6 sm:w-14 sm:h-8 bg-gray-300 rounded-full sm:rounded-2xl peer-checked:bg-purple-500 transition-all duration-300 flex items-center">
          <div
            className={`w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
              checked ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
            }`}
          ></div>
        </div>
      </label>
      <span className="text-base sm:text-lg text-gray-700 font-normal font-['Mulish']">
        {label}
      </span>
    </div>
  );
};

export default Toggle;