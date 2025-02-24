import React from 'react';

export default function FolderBlock({ name, onClick }) {
    return (
        <div 
            className="w-[244px] h-[234px] relative bg-white rounded-3xl border border-[#d7d7d7] transition-shadow duration-200 hover:shadow-[0_0_0_3px_#8A48E6]" 
            onClick={onClick}
        >
            <div data-svg-wrapper className="left-[72px] top-[40px] absolute">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8333 16.6667H37.5L50 29.1667H79.1667C81.3768 29.1667 83.4964 30.0446 85.0592 31.6074C86.622 33.1702 87.5 35.2899 87.5 37.5V70.8333C87.5 73.0435 86.622 75.1631 85.0592 76.7259C83.4964 78.2887 81.3768 79.1667 79.1667 79.1667H20.8333C18.6232 79.1667 16.5036 78.2887 14.9408 76.7259C13.378 75.1631 12.5 73.0435 12.5 70.8333V25C12.5 22.7899 13.378 20.6702 14.9408 19.1074C16.5036 17.5446 18.6232 16.6667 20.8333 16.6667Z" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div data-svg-wrapper className="left-[205px] top-[15px] absolute">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12ZM11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12ZM18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="h-11 left-[15px] bottom-6 absolute flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">{name}</div>
                <div className="self-stretch h-4 text-[#827ead] text-[15px] font-bold font-['Nunito']">Папка</div>
            </div>
        </div>
    );
}
