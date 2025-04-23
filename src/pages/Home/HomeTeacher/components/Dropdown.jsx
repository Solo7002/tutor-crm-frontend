import { useState } from "react";

export default function Dropdown({ textAll = "Усі групи", options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(textAll);
  return (
    <div className="relative border border-1 border-gray rounded-2xl w-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 sm:h-10 px-2 w-full bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center focus:outline-none"
      >
        <span className="text-[#827ead] text-sm sm:text-base md:text-lg font-bold font-['Nunito'] truncate max-w-[80%]">
          {selected}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}
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

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white border border-[#d7d7d7] rounded-2xl shadow-lg z-10 max-h-[200px] overflow-y-auto">
          {[textAll, ...options].map((option) =>
            option === selected ? null : (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                  onSelect(option);
                }}
                className="px-2 py-1 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-xs sm:text-sm md:text-base font-['Nunito'] truncate"
              >
                {option}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}