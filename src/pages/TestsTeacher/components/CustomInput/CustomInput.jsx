import React from 'react';
import "./CustomInput.css";

const CustomInput = ({ 
  label, value, onChange, onBlur, placeholder, icon, type = 'text', options = [], readOnly = false, disabled = false}) => {
  return (
    <div className="flex-1">
      <label className={`block text-xs sm:text-sm font-medium mb-1 font-['Mulish'] ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {label} <span className={`${disabled ? 'text-gray-400' : 'text-purple-500'}`}>*</span>
      </label>
      <div
        className={`relative flex items-center p-1.5 sm:p-2 border rounded-lg sm:rounded-xl transition-all duration-300 
          ${disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white'} 
          ${value && !disabled ? 'border-purple-500' : disabled ? 'border-gray-200' : 'border-gray-300'}
          ${!readOnly && !disabled ? 'focus-within:border-purple-500' : ''}`}
      >
        {type === 'select' && !readOnly ? (
          <select
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`w-full text-sm sm:text-base font-bold font-['Nunito'] focus:outline-none bg-transparent appearance-none
              ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
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
              <span className={`w-full text-sm sm:text-base font-bold font-['Nunito'] ${disabled ? 'text-gray-400' : 'text-black'}`}>
                {value}
              </span>
            ) : (
              <input
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full text-sm sm:text-base font-bold font-['Nunito'] focus:outline-none bg-transparent 
                  ${disabled ? 'text-gray-400 placeholder-gray-300 cursor-not-allowed' : 'text-black placeholder-gray-400'}
                  ${type === 'number' ? 'appearance-none' : ''}`}
                style={
                  type === 'number'
                    ? {
                        MozAppearance: 'textfield',
                      }
                    : {}
                }
              />
            )}
            {icon && (
              <div className={`w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center ${disabled ? 'opacity-50' : ''}`}>
                {icon}
              </div>
            )}
          </>
        )}
      </div>
 
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