import React from 'react';

const Toggle = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center space-x-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-14 h-8 bg-gray-300 rounded-2xl peer-checked:bg-purple-500 transition-all duration-300 flex items-center">
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          ></div>
        </div>
      </label>
      <span className="text-lg text-gray-700 font-normal font-['Mulish']">
        {label}
      </span>
    </div>
  );
};

export default Toggle;