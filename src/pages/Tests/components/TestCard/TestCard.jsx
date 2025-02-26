// TestCard.jsx
import React from 'react';
import './TestCard.css';

const TestCard = ({ type }) => {
    const getBorderColor = () => {
        switch (type) {
            case "default":
                return "#e0e0e0";
            case "overdue":
                return "#e64851";
            case "done_good":
                return "#47c974";
            case "done_medium":
                return "#ffa869";
            case "done_bad":
                return "#e64851";
            default:
                return "#e0e0e0";
        }
    };
    const getDateColor = () => {
        switch (type) {
            case "default":
                return "#8a48e6";
            case "overdue":
                return "#e64851";
            case "done_good":
                return "#47c974";
            case "done_medium":
                return "#47c974";
            case "done_bad":
                return "#47c974";
            default:
                return "8a48e6";
        }
    };
    const getButtonColor = () => {
        switch (type) {
            case "default":
                return "#8a48e6";
            case "overdue":
                return "#e64851";
            case "done_good":
                return "#48e67e";
            case "done_medium":
                return "#ffa869";
            case "done_bad":
                return "#e64851";
            default:
                return "#8a48e6";
        }
    };
    const getButtonisDone = () => {
        switch (type) {
            case "default":
                return false;
            case "overdue":
                return false;
            case "done_good":
                return true;
            case "done_medium":
                return true;
            case "done_bad":
                return true;
            default:
                return false;
        }
    };

    return (
        <div
            className={`relative w-[420px] p-4 rounded-3xl border border-${getBorderColor()} flex-col justify-start items-start gap-4 inline-flex pattern-bg`}
            style={{
                backgroundImage: "linear-gradient(to top right, white, transparent)",
                border: `1px solid ${getBorderColor()}`,
            }}
        >
            <div className="self-stretch h-[82px] flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="grow shrink basis-0 h-6 text-[#827ead] text-[15px] font-bold font-['Nunito']">Математика</div>
                    <div className="w-[168px] self-stretch text-right text-[#827ead] text-[15px] font-bold font-['Nunito']">Восьменко О. С.</div>
                </div>
                <div className="self-stretch text-[#120c38] text-xl font-normal font-['Mulish']">Основи геометрії. Прямокутна система координат</div>
            </div>
            <div className="self-stretch justify-between items-end inline-flex">
                <div className="w-[200px] flex-col justify-start items-start gap-2 inline-flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div><span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">Видано:</span><span className="text-[#827ead] text-[15px] font-normal font-['Nunito']"> </span><span className="text-[#120c38] text-[15px] font-extrabold font-['Lato']">02.03.2025</span></div>
                    </div>
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div><span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">Виконати до:</span><span className="text-[#827ead] text-[15px] font-normal font-['Nunito']"> </span><span className="text-[#8a48e6] text-[15px] font-extrabold font-['Lato']" style={{ color: getDateColor() }}>03.04.2025</span></div>
                    </div>
                </div>
                {!getButtonisDone() && (<div className={`w-[152px] h-12 p-2 bg-white rounded-[40px] border justify-end items-center gap-5 flex`} style={{borderColor: getButtonColor()}}>
                    <div className="text-[15px] font-bold font-['Nunito']" style={{color: getButtonColor()}}>Виконати</div>
                    <div data-svg-wrapper>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28 16L6.26403 5.37866C6.14004 5.33043 6.00446 5.3204 5.87472 5.34987C5.74498 5.37933 5.62703 5.44694 5.53603 5.54399C5.4427 5.64355 5.37844 5.76679 5.35023 5.90031C5.32202 6.03382 5.33095 6.17252 5.37603 6.30132L8.6667 16M28 16L6.26403 26.6213C6.14004 26.6695 6.00446 26.6796 5.87472 26.6501C5.74498 26.6206 5.62703 26.553 5.53603 26.456C5.4427 26.3564 5.37844 26.2332 5.35023 26.0997C5.32202 25.9662 5.33095 25.8275 5.37603 25.6987L8.6667 16M28 16H8.6667" stroke={getButtonColor()} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>)}
                {getButtonisDone() && (<div className="w-40 h-12 px-4 py-2 rounded-[40px] justify-between items-center inline-flex" style={{backgroundColor: getButtonColor()}}>
                    <div className="grow shrink basis-0 text-center text-white text-xl font-normal font-['Mulish']">10/12</div>
                </div>)}
            </div>
        </div>
    );
};

export default TestCard;