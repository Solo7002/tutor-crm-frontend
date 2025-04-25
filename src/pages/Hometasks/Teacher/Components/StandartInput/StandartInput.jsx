import { useState } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Функция нормализации ключа для перевода
  const normalizePlaceholderKey = (str) => {
    if (!str) return 'Default';
    // Удаляем пробелы и специальные символы, преобразуем в CamelCase
    return str
      .replace(/[^a-zA-Z0-9]/g, '') // Удаляем все, кроме букв и цифр
      .replace(/^./, (char) => char.toUpperCase()); // Первая буква заглавная
  };

  const handleBlur = async () => {
    if (validate) {
      const errors = await validate(value);
      if (errors.length > 0) {
        setIsValid(false);
        setErrorMessage(t(`HomeTaskTeacher.components.StandartInput.Errors.${errors[0]}`));
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
  };

  return (
    <div className={`input-wrappe ${isValid ? "mb-3" : "mb-1"}`}>
      <input
        className={`standart-input ${!isValid ? "input-error" : ""}`}
        type={type}
        name={name}
        placeholder={t(`HomeTaskTeacher.components.StandartInput.Placeholder.${normalizePlaceholderKey(placeholder)}`)}
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