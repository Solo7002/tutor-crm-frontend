import React from 'react';

export default function FolderUpList({ onClick }) {
    return (
        <div className="h-[70px] p-[15px] bg-white rounded-3xl border border-[#d7d7d7] transition-shadow duration-200 hover:shadow-[0_0_0_3px_#8A48E6] justify-start items-center gap-5 inline-flex" onClick={onClick}>
            <div data-svg-wrapper>
                <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 32.1667H8.33333C7.44928 32.1667 6.60143 31.8155 5.97631 31.1904C5.35119 30.5653 5 29.7174 5 28.8334V10.5C5 9.61597 5.35119 8.76812 5.97631 8.143C6.60143 7.51788 7.44928 7.16669 8.33333 7.16669H15L20 12.1667H31.6667C32.5507 12.1667 33.3986 12.5179 34.0237 13.143C34.6488 13.7681 35 14.616 35 15.5V21.3334M31.6667 37.1667V27.1667M31.6667 27.1667L36.6667 32.1667M31.6667 27.1667L26.6667 32.1667" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">Назад</div>
            </div>
        </div>
    );
}
