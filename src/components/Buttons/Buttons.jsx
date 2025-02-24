import React from 'react';
import './Buttons.css';
import clsx from "clsx";

export const PrimaryButton = ({ children, disabled, onClick, ...props }) => {
  return (
    <button
      className="primary-button"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({ children, disabled, onClick, ...props }) => {
  return (
    <button
      className="secondary-button"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
export const BlackButton = ({ children, disabled, onClick,className, ...props }) => {
  return (
    <button
    className={`black-button ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};