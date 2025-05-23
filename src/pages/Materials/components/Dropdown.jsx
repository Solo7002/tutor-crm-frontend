import { useState } from "react";

export default function Dropdown({ onSelect, categories }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0]);

    return (
        <div className="relative w-[245px]">
            {/* Заголовок dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 p-2 bg-white rounded-2xl border border-[#d7d7d7] flex justify-between items-center"
            >
                <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                    {selectedCategory}
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

            {/* Выпадающий список */}
            {isOpen && (
                <ul className="absolute w-full mt-1 bg-white border border-[#d7d7d7] rounded-2xl shadow-lg z-40">
                    {Object.keys(categories).map((category) => (
                        category === selectedCategory ? null : (
                            <li
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setIsOpen(false);
                                    onSelect(category); // Передаём категорию в родительский компонент
                                }}
                                className="p-2 hover:bg-[#f4f4f5] hover:rounded-2xl cursor-pointer text-[#827ead] text-[15px]"
                            >
                                {category} {categories[category] ? `(${categories[category].join(", ")})` : null }
                            </li>
                        )
                    ))}
                </ul>
            )}
        </div>
    );
}
