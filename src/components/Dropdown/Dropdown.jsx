import { useState, useRef, useEffect } from "react";

export default function Dropdown({textAll="Усі предмети", options, onSelectSubject, wFull=false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(textAll);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 p-2 bg-white rounded-2xl outline outline-1 outline-[#d7d7d7] flex justify-between items-center"
      >
        <span className="text-[#827ead] text-[15px] font-bold font-['Nunito'] truncate pr-2">{selected}</span>
        <svg
          width="24"
          height="24"
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
      
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white outline outline-1 outline-[#d7d7d7] rounded-2xl shadow-lg z-20 max-h-[200px] overflow-y-auto">
          {[textAll, ...options.map(subject => subject.SubjectName)].map((option) => (
            option === selected
              ? null
              : (
                <li
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                    onSelectSubject(option);
                  }}
                  className="p-2 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-[15px] truncate"
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