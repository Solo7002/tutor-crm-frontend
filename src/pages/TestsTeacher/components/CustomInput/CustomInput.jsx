import React from 'react';
import "./CustomInput.css";

const CustomInput = ({ label, value, onChange, placeholder, icon, type = 'text', options = [], readOnly = false }) => {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1 font-['Mulish']">
        {label} <span className="text-purple-500">*</span>
      </label>
      <div
        className={`relative flex items-center p-2 border rounded-xl bg-white transition-all duration-300 ${
          value ? 'border-purple-500' : 'border-gray-300'
        } ${!readOnly ? 'focus-within:border-purple-500' : ''}`}
      >
        {type === 'select' && !readOnly ? (
          <select
            value={value}
            onChange={onChange}
            className="w-full text-black text-base font-bold font-['Nunito'] focus:outline-none bg-transparent appearance-none"
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <>
            {readOnly ? (
              <span className="w-full text-black text-base font-bold font-['Nunito']">
                {value}
              </span>
            ) : (
              <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full text-black text-base font-bold font-['Nunito'] focus:outline-none bg-transparent placeholder-gray-400 ${
                  type === 'number' ? 'appearance-none' : ''
                }`}
                style={
                  type === 'number'
                    ? {
                        // Remove spinner arrows for number inputs
                        MozAppearance: 'textfield', // For Firefox
                      }
                    : {}
                }
              />
            )}
            {icon && (
              <div className="w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add global styles to remove spinner arrows for number inputs */}
      <style jsx global>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default CustomInput;