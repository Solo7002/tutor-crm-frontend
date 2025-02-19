import React from 'react';
import './Buttons.css';

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