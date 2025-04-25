import React, { useEffect, useState } from 'react';
import './MaterialsStudent.css';
import Dropdown from './components/Dropdown';
import ToggleSwitch from './components/ToggleSwitch';
import SortDropdown from './components/SortDropdown';
import SearchButton from './components/SearchButton';
import FolderBlock from './components/FolderBlock';
import MaterialBlock from './components/MaterialBlock';
import FolderList from './components/FolderList';
import MaterialList from './components/MaterialList';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import FolderUpBlock from './components/FolderUpBlock';
import FolderUpList from './components/FolderUpList';
import useCookieState from '../../utils/hooks/useCookieState';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function MaterialsStudent() {
    const { t } = useTranslation();
    const [token, setToken] = useState();
    const [isBlock, setIsBlock] = useCookieState('MaterialsStudent_displayMode', true);
    const [parent, setParent] = useCookieState('MaterialsStudent_currentFolder', null);
    const [materials, setMaterials] = useState([]);
    const [dir, setDir] = useCookieState('MaterialsStudent_currentPath', []);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [order, setOrder] = useCookieState('MaterialsStudent_sortOrder', t('MaterialsStudent.sortOptions.alphabetical'));
    
    const fileCategories = {
        [t('MaterialsStudent.fileCategories.allFormats')]: null,
        [t('MaterialsStudent.fileCategories.presentations')]: [".pptx", ".ppt"],
        [t('MaterialsStudent.fileCategories.documents')]: [".docx", ".doc"],
        [t('MaterialsStudent.fileCategories.textFiles')]: [".txt", ".rtf"],
        [t('MaterialsStudent.fileCategories.spreadsheets')]: [".csv", ".xlsx"],
        [t('MaterialsStudent.fileCategories.pdf')]: [".pdf"],
        [t('MaterialsStudent.fileCategories.images')]: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg"]
    };

    const loadMaterials = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        setToken(token);

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        try {
            await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/materials/getMaterialsByStudentUserId/${userId}`, { 
                params: { FileExtension: fileCategories[selectedCategory], ParentId: parent, order: order },
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            }).then(res => {
                setMaterials(res.data);
            });
        } catch (error) {
            toast.error(t('MaterialsStudent.searchError'));
        }
    };

    useEffect(() => {
        loadMaterials();
    }, [parent, selectedCategory, order]);

    const onFolderClick = (id, name) => {
        setParent(id);
        setDir(prevDir => [...prevDir, name]);
    };

    const onFolderUpClick = () => {
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/materials/${parent}`, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`
            }}).then(res => {
            setParent(res.data.ParentId);
            setDir(prevDir => prevDir.slice(0, -1));
        });
    };

    const onDownloadClick = (path) => {
        let fileName = path.split('/').pop();
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/files/download/${fileName}`, {
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`
            }})
            .then(res => {
                window.open(res.data.url);
            })
            .catch(err => {  
                toast.error(t('MaterialsStudent.searchError'));
            });
    };

    const onSearchClick = () => {
        setDir([]);
        if (searchValue === '') {
            setParent(null);
            loadMaterials();
            return;
        }
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/materials/search`, { 
            params: { MaterialName: searchValue, Type: "file" },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setMaterials(res.data.data);
        });
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleSortSelect = (o) => {
        setOrder(o);
    };

    const ImgValidFormats = (filepath) => {
        if (filepath) {
            let imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
            let imgExt = filepath.split('.').pop().toLowerCase();
            return imgFormats.includes(imgExt) ? filepath : null;
        }
        return null;
    };

    return (
        <div className='MaterialsStudent mr-10 mt-3'>
            <div className='my-[18px] items-center flex flex-wrap md:justify-between'>
                <div className="gap-2 flex">
                    <div className="button button-selected">
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="text-white text-[15px] font-bold font-['Nunito']">{t('MaterialsStudent.archive')}</div>
                    </div>
                    <div className="h-12 px-4 py-2 bg-white text-[#8a48e6] rounded-[32px] border border-[#8a48e6] justify-start items-center gap-2 flex relative opacity-50 cursor-not-allowed">
                        <div className="absolute -top-2 -right-2 bg-[#8A48E6] text-white text-xs px-1.5 py-0.5 rounded-xl font-medium">
                            {t('MaterialsStudent.soon')}
                        </div>
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">{t('MaterialsStudent.shop')}</div>
                    </div>
                </div>
                <div className="gap-2 flex w-full mt-2 md:w-auto md:mt-0">
                    <SearchButton onSearchClick={onSearchClick} value={searchValue} setValue={setSearchValue} />
                </div>
            </div>
            <div className='w-full flex flex-wrap md:justify-between'>
                <div className="gap-2 flex flex-wrap">
                    <ToggleSwitch isOn={isBlock} setIsOn={setIsBlock} />
                    <Dropdown categories={fileCategories} onSelect={handleCategorySelect} />
                </div>
                <div className="gap-2 flex mt-2 md:mt-0">
                    <SortDropdown
                        options={[
                            t('MaterialsStudent.sortOptions.alphabetical'), 
                            t('MaterialsStudent.sortOptions.newest'), 
                            t('MaterialsStudent.sortOptions.oldest')
                        ]}
                        onSelect={(option) => handleSortSelect(option)}
                    />
                </div>
            </div>
            <div className='mt-6 mb-4 font-[Nunito] text-[15px] text-[#827FAE] font-bold'>
                {t('MaterialsStudent.archive')}
                {dir.map((d, index) => ' / ' + d)}
            </div>
            <div className={`w-full flex flex-wrap gap-4 mt-4 mb-8`}>
                <div className={`w-full text-center font-[Nunito] text-[16px] text-[#827FAE] ${parent === null && materials.length === 0 ? "" : "hidden"}`}>
                    {t('MaterialsStudent.noMaterials')}
                </div>
                {parent === null ? null : isBlock ? <FolderUpBlock onClick={onFolderUpClick} /> : <FolderUpList onClick={onFolderUpClick} />}
                {materials.map((m, index) =>
                    m.Type === "folder" ? (
                        isBlock ? (
                            <FolderBlock name={m.MaterialName} onClick={() => onFolderClick(m.MaterialId, m.MaterialName)} />
                        ) : (
                            <FolderList name={m.MaterialName} onClick={() => onFolderClick(m.MaterialId, m.MaterialName)} />
                        )
                    ) : (
                        isBlock ? (
                            <MaterialBlock
                                name={m.MaterialName}
                                ext={m.FilePath.split('.').pop().toUpperCase()}
                                img={ImgValidFormats(m.FilePath)}
                                onDownloadClick={() => onDownloadClick(m.FilePath)}
                            />
                        ) : (
                            <MaterialList
                                name={m.MaterialName}
                                ext={m.FilePath.split('.').pop().toUpperCase()}
                                onDownloadClick={() => onDownloadClick(m.FilePath)}
                            />
                        )
                    )
                )}
            </div>
        </div>
    );
}