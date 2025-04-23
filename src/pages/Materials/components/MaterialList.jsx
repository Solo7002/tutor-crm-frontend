import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './styles/Material.css';

export default function MaterialList({ name, ext, img, onDownloadClick, materialId = null, onDelete, onEdit, openAccessModalHandler }) {
    const [isEditDelVisible, setIsEditDelVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    useEffect(() => {
        setIsEditDelVisible(false);
    }, [isEditing]);

    const handleSave = () => {
        if (newName.trim() !== '' && newName !== name) {
            onEdit(newName, materialId);
            setIsEditing(false);

            toast.success(
                <div>
                    <p>Назву матеріалу змінено</p>
                    <p>Нова назва: {newName}</p>
                </div>
            );
        } else {
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        toast.info(
            <div>
                <p>Ви впевнені, що хочете видалити цей матеріал?</p>
                <div className="flex gap-2 mt-2">
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => {
                            onDelete(materialId);

                            toast.dismiss();
                            toast.success(
                                <div>
                                    <p>Матеріал успішно видалено!</p>
                                    <p>Назва: {name}</p>
                                </div>,
                                { autoClose: 5000 }
                            );
                        }}
                    >
                        Видалити
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        onClick={() => toast.dismiss()}
                    >
                        Скасувати
                    </button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    }

    return (
        <div className="w-full h-[74px] p-[15px] bg-white rounded-3xl border border-[#d7d7d7] transition-shadow duration-200 hover:shadow-[0_0_0_3px_#8A48E6] justify-start items-center gap-5 inline-flex relative">
            <div data-svg-wrapper>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.3333 5V11.6667C23.3333 12.1087 23.5089 12.5326 23.8215 12.8452C24.134 13.1577 24.558 13.3333 25 13.3333H31.6667" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28.3333 35H11.6667C10.7826 35 9.93476 34.6488 9.30964 34.0237C8.68452 33.3986 8.33333 32.5507 8.33333 31.6667V8.33333C8.33333 7.44928 8.68452 6.60143 9.30964 5.97631C9.93476 5.35119 10.7826 5 11.6667 5H23.3333L31.6667 13.3333V31.6667C31.6667 32.5507 31.3155 33.3986 30.6903 34.0237C30.0652 34.6488 29.2174 35 28.3333 35Z" stroke="#827FAE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
                {isEditing ? (
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                        autoFocus
                        placeholder="Введіть нову назву"
                        className="self-stretch text-[#120C38] text-[15px] font-normal font-['Mulish'] outline outline-1 outline-[#8A48E6] rounded-lg p-1 cursor-pointer hover:outline-[1.2px]"
                    />
                ) : (
                    <div className="self-stretch text-[#120c38] text-[15px] font-normal font-['Nunito']">{name}</div>
                )}
                <div className="self-stretch h-4 text-[#827ead] text-xs font-normal font-['Nunito']">{ext}</div>
            </div>
            
            {materialId && (
                <div
                    className="cursor-pointer mr-4"
                    onClick={() => setIsEditDelVisible(true)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="white" />
                        <path
                            d="M4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12ZM11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12ZM18 12C18 12.2652 18.1054 12.5196 18.2929 12.7071C18.4804 12.8946 18.7348 13 19 13C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11C18.7348 11 18.4804 11.1054 18.2929 11.2929C18.1054 11.4804 18 11.7348 18 12Z"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            <div
                className={`absolute left-0 top-[74px] w-full max-w-full px-[15px] py-[15px] bg-white rounded-b-3xl shadow-[1px_1px_5px_0px_rgba(0,0,0,0.17)] z-30 inline-flex flex-col justify-start items-start gap-[15px] overflow-hidden transition-all duration-300 ${
                    isEditDelVisible
                        ? 'h-[175px] opacity-100 pointer-events-auto'
                        : 'h-0 opacity-0 pointer-events-none'
                }`}
            >
                <button
                    onClick={handleDelete}
                    className="h-10 pl-2 pr-2.5 py-2.5 bg-white rounded-[40px] inline-flex justify-start items-center gap-2.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4 7H20M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7M10 12L14 16M14 12L10 16"
                            stroke="#E64851"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="justify-center text-[#e64851] text-[15px] font-bold font-['Nunito']">Видалити</div>
                </button>

                <button
                    onClick={() => setIsEditing(true)}
                    className="h-10 pl-2 pr-2.5 py-2.5 bg-white rounded-[40px] inline-flex justify-start items-center gap-2.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16 5.00011L19 8.00011M20.385 6.58511C20.7788 6.19126 21.0001 5.65709 21.0001 5.10011C21.0001 4.54312 20.7788 4.00895 20.385 3.61511C19.9912 3.22126 19.457 3 18.9 3C18.343 3 17.8088 3.22126 17.415 3.61511L9 12.0001V15.0001H12L20.385 6.58511Z"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="justify-center text-[#120c38] text-[15px] font-bold font-['Nunito']">Змінити назву</div>
                </button>

                <button
                    onClick={() => openAccessModalHandler(materialId)}
                    className="h-10 pl-2 pr-2.5 py-2.5 bg-white rounded-[40px] inline-flex justify-start items-center gap-2.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="justify-center text-[#120c38] text-[15px] font-bold font-['Nunito']">Керування доступом</div>
                </button>

                <button
                    onClick={() => setIsEditDelVisible(false)}
                    className="w-10 h-10 p-2 absolute right-[15px] top-[15px] bg-white rounded-[40px] inline-flex justify-center items-center hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 8L16 16M8 16L16 8"
                            stroke="#120C38"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div data-svg-wrapper className="downloadButton cursor-pointer" onClick={onDownloadClick} style={{display: isEditing ? "none" : "block"}}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="40" rx="20" fill="white" />
                    <path d="M12 25V27C12 27.5304 12.2107 28.0391 12.5858 28.4142C12.9609 28.7893 13.4696 29 14 29H26C26.5304 29 27.0391 28.7893 27.4142 28.4142C27.7893 28.0391 28 27.5304 28 27V25M15 19L20 24M20 24L25 19M20 24V12" stroke="#8A48E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}