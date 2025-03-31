import { useState } from "react";
import "./StandartInput.css";

const StandartInput = ({ 
  type = "text", 
  name, 
  placeholder, 
  value, 
  onChange, 
  validate,
  onValidationChange
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBlur = async () => {
    if (validate) {
      const errors = await validate(value);
      if (errors.length > 0) {
        setIsValid(false);
        setErrorMessage(errors[0]);
        if (onValidationChange) onValidationChange(name, false);
      } else {
        setIsValid(true);
        setErrorMessage("");
        if (onValidationChange) onValidationChange(name, true);
      }
    }
  };

  const handleFocus = () => {
    setIsValid(true);
  }


  return (
    <div className={`input-wrappe ${isValid?"mb-3":"mb-1"}`}>
      <input
        className={`standart-input ${!isValid ? "input-error" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {!isValid && <p className="error-text">{errorMessage}</p>}
    </div>
  );
};

export default StandartInput;