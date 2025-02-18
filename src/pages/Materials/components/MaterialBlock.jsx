import React from 'react';
import './styles/Material.css';

export default function MaterialBlock({ name, ext, img, onDownloadClick }) {
    return (
        <div className="w-[244px] h-[234px] relative bg-white rounded-3xl border border-[#d7d7d7]">
            <img className="w-[244px] h-40 rounded-tl-3xl rounded-tr-3xl absolute top-0 left-0" src={`${img ?? "/assets/materials/Rectangle47.png"}`} alt='' />
            <div className="self-stretch justify-between items-start inline-flex">
                <div className="h-11 left-[15px] bottom-6 absolute flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">{name}</div>
                    <div className="self-stretch h-4 text-[#827ead] text-[15px] font-bold font-['Nunito']">{ext}</div>
                </div>
                <div data-svg-wrapper className="downloadButton right-[15px] bottom-6 absolute" onClick={onDownloadClick}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="20" fill="white" />
                        <path d="M12 25V27C12 27.5304 12.2107 28.0391 12.5858 28.4142C12.9609 28.7893 13.4696 29 14 29H26C26.5304 29 27.0391 28.7893 27.4142 28.4142C27.7893 28.0391 28 27.5304 28 27V25M15 19L20 24M20 24L25 19M20 24V12" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
