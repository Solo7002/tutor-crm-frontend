import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function Dropdown({ options, onSelectSubject, selectedValue }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedValue || t('HometaskStudent.components.Dropdown.AllSubjects'));

  useEffect(() => {
    setSelected(selectedValue || t('HometaskStudent.components.Dropdown.AllSubjects'));
  }, [selectedValue, t]);

  useEffect(() => {
    if (!options || options.length === 0) {
      toast.error(t('HometaskStudent.components.Dropdown.Errors.NoOptions'), {
        position: "bottom-right",
        autoClose: 5000,
      });
    }
  }, [options, t]);

  return (
    <div className="relative w-[245px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center"
      >
        <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
          {selected || t('HometaskStudent.components.Dropdown.AllSubjects')}
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
          {[t('HometaskStudent.components.Dropdown.AllSubjects'), ...options.map(op => op)].map((option) => (
            option === selected
              ? null
              : (
                <li
                  key={option || t('HometaskStudent.components.Dropdown.AllSubjects')}
                  onClick={() => {
                    const value = option || t('HometaskStudent.components.Dropdown.AllSubjects');
                    setSelected(value);
                    setIsOpen(false);
                    onSelectSubject(value);
                  }}
                  className="p-2 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-[15px]"
                >
                  {option || t('HometaskStudent.components.Dropdown.AllSubjects')}
                </li>
              )
          ))}
        </ul>
      )}
    </div>
  );
}