import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function FolderCreateList({ parentId, teacherId, token, setShowFolderCreateList, setRefreshData }) {
    const [folderName, setFolderName] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleBlur = () => {
        if (folderName.trim() === '') {
            setShowFolderCreateList(false);
        } else {
            const currentDate = new Date().toISOString();
            axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/materials`, {
                MaterialName: folderName,
                Type: 'folder',
                FilePath: null,
                FileImage: null,
                AppearanceDate: currentDate,
                ParentId: parentId,
                TeacherId: teacherId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setShowFolderCreateList(false);
                setRefreshData(prev => !prev);
                
                toast.success("Нову папку створено");
            })
            .catch(error => {
                toast.error("Сталася помилка, спробуйте ще раз");
            });
        }
    };

    return (
        <div className="w-full h-[74px] p-[15px] bg-white rounded-3xl border border-[#d7d7d7] justify-start items-center gap-5 inline-flex relative">
            <div data-svg-wrapper>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.33333 6.66666H15L20 11.6667H31.6667C32.5507 11.6667 33.3986 12.0178 34.0237 12.643C34.6488 13.2681 35 14.1159 35 15V28.3333C35 29.2174 34.6488 30.0652 34.0237 30.6903C33.3986 31.3155 32.5507 31.6667 31.6667 31.6667H8.33333C7.44928 31.6667 6.60143 31.3155 5.97631 30.6903C5.35119 30.0652 5 29.2174 5 28.3333V9.99999C5 9.11593 5.35119 8.26809 5.97631 7.64297C6.60143 7.01785 7.44928 6.66666 8.33333 6.66666Z" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                <input 
                    ref={inputRef}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder='Введіть назву' 
                    className="w-full text-[#120C38] text-[15px] font-normal font-['Mulish'] outline outline-1 outline-[#8A48E6] rounded-lg p-1 cursor-pointer hover:outline-[1.2px]"
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlur();
                    }}
                />
                <div className="self-stretch h-4 text-[#827ead] text-xs font-bold font-['Nunito']">Папка</div>
            </div>
        </div>
    );
}