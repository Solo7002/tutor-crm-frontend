import React from 'react';

export default function FolderUpBlock({ onClick }) {
    return (
        <div className="w-[244px] h-[234px] relative bg-white rounded-3xl border border-[#d7d7d7] flex-col justify-center items-center gap-[35px] inline-flex" onClick={onClick}>
            <div data-svg-wrapper className="left-[72px] top-[40px] absolute">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 79.1667H20.8333C18.6232 79.1667 16.5036 78.2887 14.9408 76.7259C13.378 75.1631 12.5 73.0435 12.5 70.8334V25C12.5 22.7899 13.378 20.6703 14.9408 19.1075C16.5036 17.5447 18.6232 16.6667 20.8333 16.6667H37.5L50 29.1667H79.1667C81.3768 29.1667 83.4964 30.0447 85.0592 31.6075C86.622 33.1703 87.5 35.2899 87.5 37.5V52.0834M79.1667 91.6667V66.6667M79.1667 66.6667L91.6667 79.1667M79.1667 66.6667L66.6667 79.1667" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="h-11 left-[15px] bottom-6 absolute flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">Назад</div>
            </div>
        </div>
    );
}
