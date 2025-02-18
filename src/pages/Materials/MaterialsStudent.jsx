import React, { useEffect, useState } from 'react';
import './MaterialsStudent.css'
import Dropdown from './components/Dropdown';
import ToggleSwitch from './components/ToggleSwitch';
import SortDropdown from './components/SortDropdown';
import SearchButton from './components/SearchButton';
import FolderBlock from './components/FolderBlock';
import MaterialBlock from './components/MaterialBlock';
import FolderList from './components/FolderList';
import MaterialList from './components/MaterialList';
import Navbar from '../../layouts/Navbar';
import axios from 'axios';
import FolderUpBlock from './components/FolderUpBlock';

export default function MaterialsStudent() {
    const [isBlock, setIsBlock] = useState(true);
    const [parent, setParent] = useState(null);
    // const materials = [
    //     {
    //         MaterialName: "Основні матеріали",
    //         Type: "folder"
    //     },
    //     {
    //         MaterialName: "Додаткові матеріали",
    //         Type: "folder"
    //     },
    //     {
    //         MaterialName: "Назва книги",
    //         Type: "file",
    //         file: {
    //             ext: "PDF",
    //             img: null
    //         }
    //     },
    //     {
    //         MaterialName: "Документ",
    //         Type: "file",
    //         file: {
    //             ext: "DOCX",
    //             img: null
    //         }
    //     },
    //     {
    //         MaterialName: "Текстовий файл",
    //         Type: "file",
    //         file: {
    //             ext: "TXT",
    //             img: null
    //         }
    //     },
    //     {
    //         MaterialName: "Зображення",
    //         Type: "file",
    //         file: {
    //             ext: "CSV",
    //             img: "/assets/dark_logo.png"
    //         }
    //     },
    //     {
    //         MaterialName: "Документація",
    //         Type: "file",
    //         file: {
    //             ext: "PDF",
    //             img: null
    //         }
    //     },
    // ]

    // eslint-disable-next-line
    const [materials, setMaterials] = useState([]);
    // eslint-disable-next-line
    const [dir, setDir] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/materials', { params: { ParentId: parent } }).then(res => {
            console.log('res', res)
            setMaterials(res.data);
        })
    }, [parent])

    const onFolderClick = (id, name) => {
        setParent(id);
        dir.push(name);
    }
    const onFolderUpClick = () => {
        axios.get(`http://localhost:4000/api/materials/${parent}`).then(res => {
            setParent(res.data.ParentId);
            dir.pop();
        })
    }

    return (
        <Navbar>
            <div className='MaterialsStudent'>
                <div className='buttons-box'>
                    <div className="gap-2 flex">
                        <div className="button button-selected">
                            <div data-svg-wrapper>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="text-white text-[15px] font-bold font-['Nunito']">Архів</div>
                            <div className="w-4 h-4 relative bottom-4 left-4">
                                <div className="w-5 h-5 left-0 top-0 absolute bg-[#8a48e6] rounded-full border-2 border-white" />
                                <div className="w-[13.33px] h-[13.33px] left-[3px] top-[2px] absolute text-center text-white text-[13px] font-bold font-['Nunito']">5</div>
                            </div>
                        </div>
                        <div className="button">
                            <div data-svg-wrapper>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">Магазин</div>
                        </div>
                        <div className="button">
                            <div data-svg-wrapper>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">Від викладачів</div>
                        </div>
                    </div>

                    <div className="gap-2 flex">
                        <SearchButton />
                        <div className="items-center gap-2 flex">
                            <div data-svg-wrapper>
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="24" fill="white" />
                                    <path d="M13.3334 13.3333H34.6667V16.2293C34.6666 16.9365 34.3855 17.6147 33.8854 18.1147L28 24V33.3333L20 36V24.6667L14.0267 18.096C13.5806 17.6052 13.3334 16.9659 13.3334 16.3027V13.3333Z" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='buttons-box'>
                    <div className="gap-2 flex">
                        <ToggleSwitch isOn={isBlock} setIsOn={setIsBlock} />
                        <Dropdown />
                    </div>

                    <div className="gap-2 flex">
                        <SortDropdown
                            options={["Спочатку нові", "Спочатку старі", "За алфавітом"]}
                            onSelect={(option) => console.log("Выбрано:", option)}
                        />

                    </div>
                </div>
                <div className='mb-4 font-[Nunito] text-[15px] text-[#827FAE] font-bold'>
                    Архів
                    {
                        dir.map((d, index) =>
                            ' / ' + d
                        )
                    }
                </div>
                <div className={`main w-full ${isBlock ? "grid grid-cols-[repeat(auto-fill,minmax(234px,1fr))] gap-3" : "flex flex-col gap-3"}`}>
                    {
                        parent === null
                            ?
                            null
                            :
                            <FolderUpBlock onClick={onFolderUpClick} />
                    }
                    {
                        materials.map((m, index) =>
                            m.Type === "folder"
                                ?
                                isBlock ? <FolderBlock name={m.MaterialName} onClick={() => onFolderClick(m.MaterialId, m.MaterialName)} /> : <FolderList name={m.MaterialName} />
                                :
                                isBlock ? <MaterialBlock name={m.MaterialName} ext={"ext"} img={m.file?.img} /> : <MaterialList name={m.MaterialName} ext={"ext"} />
                        )
                    }
                </div>

            </div>
        </Navbar>
    );
}
