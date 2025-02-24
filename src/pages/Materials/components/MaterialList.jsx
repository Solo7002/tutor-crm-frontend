import React from 'react';
import './styles/Material.css';

export default function MaterialList({ name, ext, img, onDownloadClick }) {
    return (
        <div className="h-[74px] p-[15px] bg-white rounded-3xl border border-[#d7d7d7] transition-shadow duration-200 hover:shadow-[0_0_0_3px_#8A48E6] justify-start items-center gap-5 inline-flex">
            <div data-svg-wrapper>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.3333 5V11.6667C23.3333 12.1087 23.5089 12.5326 23.8215 12.8452C24.134 13.1577 24.558 13.3333 25 13.3333H31.6667" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M28.3333 35H11.6667C10.7826 35 9.93476 34.6488 9.30964 34.0237C8.68452 33.3986 8.33333 32.5507 8.33333 31.6667V8.33333C8.33333 7.44928 8.68452 6.60143 9.30964 5.97631C9.93476 5.35119 10.7826 5 11.6667 5H23.3333L31.6667 13.3333V31.6667C31.6667 32.5507 31.3155 33.3986 30.6903 34.0237C30.0652 34.6488 29.2174 35 28.3333 35Z" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">{name}</div>
                <div className="self-stretch h-4 text-[#827ead] text-xs font-normal font-['Nunito']">{ext}</div>
            </div>
            <div data-svg-wrapper className="downloadButton" onClick={onDownloadClick}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="white" />
                    <path d="M12 25V27C12 27.5304 12.2107 28.0391 12.5858 28.4142C12.9609 28.7893 13.4696 29 14 29H26C26.5304 29 27.0391 28.7893 27.4142 28.4142C27.7893 28.0391 28 27.5304 28 27V25M15 19L20 24M20 24L25 19M20 24V12" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    );
}
