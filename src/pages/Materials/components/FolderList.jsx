import React from 'react';

export default function FolderList({ name, onClick }) {
    return (
        <div className="w-full h-[74px] p-[15px] bg-white rounded-3xl border border-[#d7d7d7] transition-shadow duration-200 hover:shadow-[0_0_0_3px_#8A48E6] justify-start items-center gap-5 inline-flex" onClick={onClick}>
            <div data-svg-wrapper>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33333 6.66666H15L20 11.6667H31.6667C32.5507 11.6667 33.3986 12.0178 34.0237 12.643C34.6488 13.2681 35 14.1159 35 15V28.3333C35 29.2174 34.6488 30.0652 34.0237 30.6903C33.3986 31.3155 32.5507 31.6667 31.6667 31.6667H8.33333C7.44928 31.6667 6.60143 31.3155 5.97631 30.6903C5.35119 30.0652 5 29.2174 5 28.3333V9.99999C5 9.11593 5.35119 8.26809 5.97631 7.64297C6.60143 7.01785 7.44928 6.66666 8.33333 6.66666Z" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">{name}</div>
                <div className="self-stretch h-4 text-[#827ead] text-xs font-bold font-['Nunito']">Папка</div>
            </div>
            <div data-svg-wrapper>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="white" />
                    <path d="M12 20C12 20.2652 12.1054 20.5196 12.2929 20.7071C12.4804 20.8946 12.7348 21 13 21C13.2652 21 13.5196 20.8946 13.7071 20.7071C13.8946 20.5196 14 20.2652 14 20C14 19.7348 13.8946 19.4804 13.7071 19.2929C13.5196 19.1054 13.2652 19 13 19C12.7348 19 12.4804 19.1054 12.2929 19.2929C12.1054 19.4804 12 19.7348 12 20ZM19 20C19 20.2652 19.1054 20.5196 19.2929 20.7071C19.4804 20.8946 19.7348 21 20 21C20.2652 21 20.5196 20.8946 20.7071 20.7071C20.8946 20.5196 21 20.2652 21 20C21 19.7348 20.8946 19.4804 20.7071 19.2929C20.5196 19.1054 20.2652 19 20 19C19.7348 19 19.4804 19.1054 19.2929 19.2929C19.1054 19.4804 19 19.7348 19 20ZM26 20C26 20.2652 26.1054 20.5196 26.2929 20.7071C26.4804 20.8946 26.7348 21 27 21C27.2652 21 27.5196 20.8946 27.7071 20.7071C27.8946 20.5196 28 20.2652 28 20C28 19.7348 27.8946 19.4804 27.7071 19.2929C27.5196 19.1054 27.2652 19 27 19C26.7348 19 26.4804 19.1054 26.2929 19.2929C26.1054 19.4804 26 19.7348 26 20Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    );
}
