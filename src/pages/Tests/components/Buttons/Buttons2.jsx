import React from 'react';
import './Buttons.css';
import clsx from "clsx";

export const PrimaryButton = ({ children, disabled, onClick, ...props }) => {
  return (
    <button
      className="primary-button2"
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
      className="secondary-button2"
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};