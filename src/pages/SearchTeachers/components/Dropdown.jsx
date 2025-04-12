import { useState } from "react";

export default function Dropdown({ textAll = "Усі групи", options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(textAll);
  return (
    <div className="relative border border-1 border-gray rounded-2xl w-full h-full">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 w-full h-full bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center focus:outline-none"
      >
        <span className="text-[#827ead] text-lg font-bold font-['Nunito'] text-nowrap">
          {selected}
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

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white border border-[#d7d7d7] rounded-2xl shadow-lg z-10">
          {[textAll, ...options].map((option) =>
            option === selected ? null : (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                  onSelect(option);
                }}
                className="px-2 py-1 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-lg font-['Nunito']"
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