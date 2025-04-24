import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function FolderCreateBlock({ parentId, teacherId, token, setShowFolderCreateBlock, setRefreshData }) {
    const [folderName, setFolderName] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleBlur = () => {
        if (folderName.trim() === '') {
            setShowFolderCreateBlock(false);
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
                setShowFolderCreateBlock(false);
                setRefreshData(prev => !prev);

                
                toast.success("Нову папку створено");
            })
            .catch(error => {
                toast.error("Сталася помилка, спробуйте ще раз");
            });
        }
    };

    return (
        <div 
            className="w-[244px] h-[234px] relative bg-white rounded-3xl border border-[#d7d7d7]"
        >
            <div data-svg-wrapper className="left-[72px] top-[40px] absolute">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8333 16.6667H37.5L50 29.1667H79.1667C81.3768 29.1667 83.4964 30.0446 85.0592 31.6074C86.622 33.1702 87.5 35.2899 87.5 37.5V70.8333C87.5 73.0435 86.622 75.1631 85.0592 76.7259C83.4964 78.2887 81.3768 79.1667 79.1667 79.1667H20.8333C18.6232 79.1667 16.5036 78.2887 14.9408 76.7259C13.378 75.1631 12.5 73.0435 12.5 70.8333V25C12.5 22.7899 13.378 20.6702 14.9408 19.1074C16.5036 17.5446 18.6232 16.6667 20.8333 16.6667Z" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="h-11 left-[15px] bottom-6 absolute flex-col justify-start items-start gap-1.5 inline-flex">
                <input 
                    ref={inputRef}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder='Введіть назву' 
                    className="self-stretch text-[#120C38] text-[15px] font-normal font-['Mulish'] outline outline-1 outline-[#8A48E6] rounded-lg p-1 cursor-pointer hover:outline-[1.2px]"
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlur();
                    }}
                />
                <div className="self-stretch h-4 text-[#827ead] text-[15px] font-bold font-['Nunito']">Папка</div>
            </div>
        </div>
    );
}