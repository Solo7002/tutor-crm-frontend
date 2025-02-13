import { useState } from "react";

export default function SortDropdown({ options, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        if (onSelect) {
            onSelect(option);
        }
    };

    return (
        <div className="relative w-[160px]">
            <button
                className="w-full h-8 flex items-center justify-between text-[#827EAD] text-[15px] font-bold font-['Nunito'] cursor-pointer px-3 rounded-md"
                onClick={toggleDropdown}
            >
                {selected}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                >
                    <path
                        d="M12.0049 13.9139L17.4312 8.28708C17.6158 8.0957 17.8311 8.00306 18.0772 8.00919C18.3233 8.01531 18.5386 8.11432 18.7232 8.30622C18.9077 8.49812 19 8.72141 19 8.97608C19 9.23075 18.9077 9.45404 18.7232 9.64593L13.057 15.5407C12.9093 15.6938 12.7432 15.8086 12.5586 15.8852C12.3741 15.9617 12.1895 16 12.0049 16C11.8204 16 11.6358 15.9617 11.4512 15.8852C11.2667 15.8086 11.1006 15.6938 10.9529 15.5407L5.26826 9.64593C5.0837 9.45455 4.99437 9.22794 5.00027 8.96613C5.00618 8.70431 5.10166 8.47796 5.28672 8.28708C5.47178 8.09621 5.68711 8.00051 5.9327 8C6.1783 7.99949 6.39363 8.09519 6.57869 8.28708L12.0049 13.9139Z"
                        fill="#827FAE"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul className="absolute top-9 left-0 w-full bg-white border border-[#D7D7D7] rounded-md shadow-md z-10 text-[#827ead] text-[15px] font-bold font-['Nunito']">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 hover:rounded-md cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
