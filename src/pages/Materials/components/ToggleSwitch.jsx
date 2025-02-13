import './styles/ToggleSwitch.css';

export default function ToggleSwitch({ isOn, setIsOn, onToggle }) {

    const handleClick = () => {
        setIsOn(!isOn);
        if (onToggle) {
            onToggle(!isOn);
        }
    };

    return (
        <div
            className={`switch ${isOn ? "switch-active" : ""}`}
            onClick={handleClick}
        >
            <div data-svg-wrapper>
                <svg width="82" height="42" viewBox="0 0 82 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="81" height="41" rx="16.5" fill="white" />
                    <rect x="0.5" y="0.5" width="81" height="41" rx="16.5" stroke="#D7D7D7" />
                    {/* Иконка списка */}
                    <rect className={`absolute transition-transform flex items-center justify-center z-10`} x="42.5" y="2.5" width="37" height="37" rx="14.5" fill="#827FAE" />
                    <rect className={`absolute transition-transform flex items-center justify-center z-10 `} x="42.5" y="2.5" width="37" height="37" rx="14.5" stroke="white" stroke-width="3" />
                    <path d="M27 12C27.7956 12 28.5587 12.3161 29.1213 12.8787C29.6839 13.4413 30 14.2044 30 15V17C30 17.7956 29.6839 18.5587 29.1213 19.1213C28.5587 19.6839 27.7956 20 27 20H15C14.2044 20 13.4413 19.6839 12.8787 19.1213C12.3161 18.5587 12 17.7956 12 17V15C12 14.2044 12.3161 13.4413 12.8787 12.8787C13.4413 12.3161 14.2044 12 15 12H27ZM27 22C27.7956 22 28.5587 22.3161 29.1213 22.8787C29.6839 23.4413 30 24.2044 30 25V27C30 27.7956 29.6839 28.5587 29.1213 29.1213C28.5587 29.6839 27.7956 30 27 30H15C14.2044 30 13.4413 29.6839 12.8787 29.1213C12.3161 28.5587 12 27.7956 12 27V25C12 24.2044 12.3161 23.4413 12.8787 22.8787C13.4413 22.3161 14.2044 22 15 22H27Z" className="fill-[#827FAE]" />
                    <path className="stroke-white" d="M58 15H69M58 21H69M58 27H69M54 15V15.01M54 21V21.01M54 27V27.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

                </svg>
            </div>

            {/* Ползунок */}
            <div
                className={`absolute w-[37px] h-[37px] transition-transform flex items-center justify-center z-10 ${isOn ? " translate-x-[38px]" : "translate-x-[2px]"
                    }`}
            >
            </div>
        </div>
    );
}
