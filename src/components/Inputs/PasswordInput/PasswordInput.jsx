import { useState, useEffect } from "react";
import "./PasswordInput.css";

const PasswordInput = ({
  name = "password",
  value = "",
  placeholder = "Пароль",
  onChange,
  validate,
  onValidationChange,
  onBlurOff = false,
  onTrigger = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const errors = [];
    const minLength = 8;
    const maxLength = 128;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
    const allowedChars = /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/.test(password);

    if (!password) {
      errors.push("Це поле не може бути порожнім");
    } else {
      if (password.length < minLength || password.length > maxLength) {
        errors.push(`Пароль повинен містити від ${minLength} до ${maxLength} символів`);
      }
      if (!hasLowercase) {
        errors.push("Пароль повинен містити принаймні одну малу літеру (a-z)");
      }
      if (!hasUppercase) {
        errors.push("Пароль повинен містити принаймні одну велику літеру (A-Z)");
      }
      if (!hasDigit) {
        errors.push("Пароль повинен містити принаймні одну цифру (0-9)");
      }
      if (!hasSpecial) {
        errors.push("Пароль повинен містити принаймні один спеціальний символ (!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)");
      }
      if (!allowedChars) {
        errors.push("Пароль містить недопустимі символи. Дозволені лише літери, цифри та спеціальні символи (!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)");
      }
    }
    return errors;
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleBlur = () => {
    if (onBlurOff) {
      return;
    }

    let errors = [];
    errors = validatePassword(value);

    if (validate) {
      const externalErrors = validate(value);
      errors = [...errors, ...externalErrors];
    }

    if (errors.length > 0) {
      setIsValid(false);
      setErrorMessage(errors[0]);
      if (onValidationChange) onValidationChange(name, false);
    } else {
      setIsValid(true);
      setErrorMessage("");
      if (onValidationChange) onValidationChange(name, true);
    }
  };

  useEffect(() => {
    if (!onTrigger) {
      return;
    }

    let errors = [];
    errors = validatePassword(value);
    
    if (validate) {
      const externalErrors = validate(value);
      errors = [...errors, ...externalErrors];
    }

    if (errors.length > 0) {
      setIsValid(false);
      setErrorMessage(errors[0]);
      if (onValidationChange) onValidationChange(name, false);
    } else {
      setIsValid(true);
      setErrorMessage("");
      if (onValidationChange) onValidationChange(name, true);
    }
  }, [onTrigger, value, validate, name, onValidationChange]);

  const handleFocus = () => {
    setIsValid(true);
    setErrorMessage("");
  }

  return (
    <div className={`password-box ${isValid ? "mb-3" : "mb-1"}`}>
      <input
        className={`password-input ${!isValid ? "input-error" : ""} w-full pr-10`}
        type={isVisible ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <button
        type="button"
        className="absolute right-4 top-3.5"
        onClick={toggleVisibility}
      >
        {isVisible ? (
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M22 12.0002C20.2531 15.5764 15.8775 19 11.9998 19C8.12201 19 3.74646 15.5764 2 11.9998" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M22 12.0002C20.2531 8.42398 15.8782 5 12.0005 5C8.1227 5 3.74646 8.42314 2 11.9998" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        ) : (
          <svg width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L22 22" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#808080" strokeWidth="1.68" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        )}
      </button>

      {!isValid && <p className="error-text">{errorMessage}</p>}
    </div>
  );
};

export default PasswordInput;