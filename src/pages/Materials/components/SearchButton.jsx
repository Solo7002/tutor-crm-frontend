import { useState, useRef, useEffect } from "react";
import './styles/SearchButton.css';

export default function SearchButton({ onSearchClick, value, setValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={inputRef} className="relative">
            {isOpen ? (
                <div className="w-[420px] h-12 px-4 py-2 bg-white rounded-[40px] gap-2 items-center flex justify-between">
                    <input
                        type="text"
                        placeholder="Шукати"
                        value={value}
                        onInput={e => setValue(e.target.value)}
                        className="text-[#827ead] w-full text-[15px] font-normal outline-none"
                        autoFocus
                    />
                    <div className="cursor-pointer searchButton absolute right-0" onClick={onSearchClick}>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="white" />
                            <path d="M36 36L28 28M12 21.3333C12 22.559 12.2414 23.7727 12.7105 24.905C13.1795 26.0374 13.867 27.0663 14.7337 27.933C15.6004 28.7997 16.6292 29.4872 17.7616 29.9562C18.894 30.4253 20.1077 30.6667 21.3333 30.6667C22.559 30.6667 23.7727 30.4253 24.905 29.9562C26.0374 29.4872 27.0663 28.7997 27.933 27.933C28.7997 27.0663 29.4872 26.0374 29.9562 24.905C30.4253 23.7727 30.6667 22.559 30.6667 21.3333C30.6667 20.1077 30.4253 18.894 29.9562 17.7616C29.4872 16.6292 28.7997 15.6004 27.933 14.7337C27.0663 13.867 26.0374 13.1795 24.905 12.7105C23.7727 12.2414 22.559 12 21.3333 12C20.1077 12 18.894 12.2414 17.7616 12.7105C16.6292 13.1795 15.6004 13.867 14.7337 14.7337C13.867 15.6004 13.1795 16.6292 12.7105 17.7616C12.2414 18.894 12 20.1077 12 21.3333Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            ) : (
                <div onClick={() => setIsOpen(true)} className="cursor-pointer searchButton">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="white" />
                        <path d="M36 36L28 28M12 21.3333C12 22.559 12.2414 23.7727 12.7105 24.905C13.1795 26.0374 13.867 27.0663 14.7337 27.933C15.6004 28.7997 16.6292 29.4872 17.7616 29.9562C18.894 30.4253 20.1077 30.6667 21.3333 30.6667C22.559 30.6667 23.7727 30.4253 24.905 29.9562C26.0374 29.4872 27.0663 28.7997 27.933 27.933C28.7997 27.0663 29.4872 26.0374 29.9562 24.905C30.4253 23.7727 30.6667 22.559 30.6667 21.3333C30.6667 20.1077 30.4253 18.894 29.9562 17.7616C29.4872 16.6292 28.7997 15.6004 27.933 14.7337C27.0663 13.867 26.0374 13.1795 24.905 12.7105C23.7727 12.2414 22.559 12 21.3333 12C20.1077 12 18.894 12.2414 17.7616 12.7105C16.6292 13.1795 15.6004 13.867 14.7337 14.7337C13.867 15.6004 13.1795 16.6292 12.7105 17.7616C12.2414 18.894 12 20.1077 12 21.3333Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
        </div>
    );
}