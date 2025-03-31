import React from "react";

const FilterButton = ({ isSelected, onSelect, type, text = "", number = 0 }) => {
  return (
    <button
      className="px-3 py-2.5 rounded-[32px] flex items-center justify-center gap-2 text-white text-[15px] font-bold font-['Nunito']"
      onClick={onSelect}
      style={{
        backgroundColor: isSelected ? "#8a48e6" : "white",
        borderWidth: 1,
        borderColor: isSelected ? "white" : "#d7d7d7",
        color: isSelected ? "white" : "#120c38",
        stroke: isSelected ? "white" : "#120c38",
      }}
    >
      <div className="mr-1">
        {type === "check" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 12L10 10V5M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604C15.5282 2.80031 14.5361 2.13738 13.4442 1.68508C12.3522 1.23279 11.1819 1 10 1C8.8181 1 7.64778 1.23279 6.55585 1.68508C5.46392 2.13738 4.47177 2.80031 3.63604 3.63604C2.80031 4.47177 2.13738 5.46392 1.68508 6.55585C1.23279 7.64778 1 8.8181 1 10Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {type === "done" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {type === "not_done" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604M5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604M5.63604 18.364L18.364 5.63604"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {text}
      <div
        className="w-5 h-5 bg-[#8a48e6] rounded-full border border-white relative"
        style={{
          backgroundColor: isSelected ? "#8a48e6" : "white",
          borderWidth: 1,
          borderColor: isSelected ? "white" : "#120c38",
          color: isSelected ? "white" : "#120c38",
        }}
      >
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 leading-[2rem] text-[13px] font-bold font-['Nunito']">
          {number}
        </div>
      </div>
    </button>
  );
};

export default FilterButton;