import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function Dropdown({ options, onSelectSubject, selectedValue, notAll }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Если notAll=true, выбираем первый вариант из списка options
    // Если notAll=false или не указан, используем selectedValue или "все предметы" (null)
    if (notAll) {
      setSelected(selectedValue || options[0]);
    } else {
      setSelected(selectedValue);
    }
  }, [selectedValue, options, notAll]);

  useEffect(() => {
    if (!options || options.length === 0) {
      toast.error(t('HometaskStudent.components.Dropdown.Errors.NoOptions'), {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  }, [options, t]);

  // Функция для отображения текущего выбранного значения
  const getDisplayValue = () => {
    if (selected === null && !notAll) {
      return t('HometaskStudent.components.Dropdown.AllSubjects');
    }
    return selected;
  };

  return (
    <div className="relative w-[245px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center"
      >
        <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
          {getDisplayValue()}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path
            d="M12 14.5V15M12 15L18 9M12 15L6 9"
            stroke="#827FAE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white border border-[#d7d7d7] rounded-2xl shadow-lg z-10">
          {/* Добавляем опцию "все предметы" только если notAll=false */}
          {!notAll && (
            <li
              onClick={() => {
                setSelected(null);
                setIsOpen(false);
                onSelectSubject(null);
              }}
              className="p-2 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-[15px]"
            >
              {t('HometaskStudent.components.Dropdown.AllSubjects')}
            </li>
          )}
          
          {options.map((option) => (
            option === selected ? null : (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                  onSelectSubject(option);
                }}
                className="p-2 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-[15px]"
              >
                {option}
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  );
}