import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import ToggleSwitch from '../components/ToggleSwitch';
import SortDropdown from '../components/SortDropdown';
import SearchButton from '../components/SearchButton';
import FolderBlock from '../components/FolderBlock';
import FolderCreateBlock from '../components/FolderCreateBlock';
import MaterialBlock from '../components/MaterialBlock';
import FolderUpBlock from '../components/FolderUpBlock';
import FolderList from '../components/FolderList';
import MaterialList from '../components/MaterialList';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import FolderUpList from '../components/FolderUpList';
import AddMaterialModal from '../components/AddMaterialModal';
import AccessManagementModal from '../components/AccessManagementModal';
import useCookieState from '../../../utils/hooks/useCookieState';
import FolderCreateList from '../components/FolderCreateList';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function MaterialsTeacher() {
    const { t } = useTranslation();
    const [token, setToken] = useState();
    const [isBlock, setIsBlock] = useCookieState('MaterialsTeacher_isBlock', true);
    const [materials, setMaterials] = useCookieState('MaterialsTeacher_materials', []);
    const [currentFolder, setCurrentFolder] = useCookieState('MaterialsTeacher_currentFolder', null);
    const [searchValue, setSearchValue] = useCookieState('MaterialsTeacher_searchValue', '');
    const [selectedCategory, setSelectedCategory] = useCookieState('MaterialsTeacher_selectedCategory', t("MaterialsTeacher.allFormats"));
    const [sortOrder, setSortOrder] = useCookieState('MaterialsTeacher_sortOrder', t("MaterialsTeacher.sortAlphabetically"));
    const [dir, setDir] = useCookieState('MaterialsTeacher_dir', []);
    const [teacherId, setTeacherId] = useCookieState('MaterialsTeacher_teacherId', null);
    const [nowParentId, setNowParentId] = useCookieState('MaterialsTeacher_nowParentId', null);
    const [refreshData, setRefreshData] = useCookieState('MaterialsTeacher_refreshData', false);
    const [showFolderCreateBlock, setShowFolderCreateBlock] = useCookieState('MaterialsTeacher_showFolderCreateBlock', false);

    const [isAddMaterialModalOpened, setIsAddMaterialModalOpened] = useCookieState('MaterialsTeacher_isAddMaterialModalOpened', false);
    const [isAccessManagementModalOpened, setIsAccessManagementModalOpened] = useCookieState('MaterialsTeacher_isAccessManagementModalOpened', false);
    const [selectedMaterial, setSelectedMaterial] = useCookieState('MaterialsTeacher_selectedMaterial', {});

    const fileCategories = {
        [t("MaterialsTeacher.allFormats")]: null,
        [t("MaterialsTeacher.presentations")]: [".pptx", ".ppt"],
        [t("MaterialsTeacher.documents")]: [".docx", ".doc"],
        [t("MaterialsTeacher.textFiles")]: [".txt", ".rtf"],
        [t("MaterialsTeacher.spreadsheets")]: [".csv", ".xlsx"],
        [t("MaterialsTeacher.pdf")]: [".pdf"],
        [t("MaterialsTeacher.images")]: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg"]
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        setToken(token);

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/materials/getByUserId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMaterials(response.data.Materials);
                setTeacherId(response.data.TeacherId);
            } catch (error) {
                toast.error(t("MaterialsTeacher.errorMessage"));
            }
        };
        fetchMaterials();
    }, [refreshData, t]);

    const handleFolderClick = (folder) => {
        setCurrentFolder(folder);
        setDir([...dir, folder.MaterialName]);
        setNowParentId(folder.MaterialId);
    };

    const handleFolderUpClick = () => {
        if (currentFolder) {
            const parentFolder = materials.find(material => material.MaterialId === currentFolder.ParentId);
            setCurrentFolder(parentFolder || null);
            setDir(dir.slice(0, -1));
            setNowParentId(parentFolder ? parentFolder.MaterialId : null);
        }
    };

    const onDownloadClick = (path) => {
        let fileName = path.split('/').pop();
        axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/files/download/${fileName}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                window.open(res.data.url);
            })
            .catch(err => toast.error(t("MaterialsTeacher.errorMessage")));
    };

    const isSearching = searchValue.trim() !== '';

    const displayedMaterials = isSearching
        ? materials.filter(material =>
            material.Type === 'file' &&
            material.MaterialName.toLowerCase().includes(searchValue.toLowerCase())
        )
        : materials.filter(material =>
            (currentFolder === null && material.ParentId === null) ||
            (currentFolder && material.ParentId === currentFolder.MaterialId)
        );

    const filterByCategory = (materials) => {
        const categoryExtensions = fileCategories[selectedCategory];
        if (!categoryExtensions) return materials;
        return materials.filter(material => {
            if (material.Type === 'folder') return true;
            const ext = '.' + material.FilePath.split('.').pop();
            return categoryExtensions.includes(ext);
        });
    };

    const sortMaterials = (materials) => {
        return [...materials].sort((a, b) => {
            if (sortOrder === t("MaterialsTeacher.sortAlphabetically")) {
                return a.MaterialName.localeCompare(b.MaterialName);
            } else if (sortOrder === t("MaterialsTeacher.sortNewest")) {
                return new Date(b.AppearanceDate) - new Date(a.AppearanceDate);
            } else if (sortOrder === t("MaterialsTeacher.sortOldest")) {
                return new Date(a.AppearanceDate) - new Date(b.AppearanceDate);
            }
            return 0;
        });
    };

    const filteredMaterials = filterByCategory(displayedMaterials);
    const sortedMaterials = sortMaterials(filteredMaterials);

    const folders = isSearching ? [] : sortedMaterials.filter(material => material.Type === 'folder');
    const files = isSearching ? sortedMaterials : sortedMaterials.filter(material => material.Type === 'file');

    const ImgValidFormats = (filepath) => {
        if (filepath) {
            let imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
            let imgExt = filepath.split('.').pop().toLowerCase();
            return imgFormats.includes(imgExt) ? filepath : null;
        }
        return null;
    };

    const handleMaterialEdit = async (newName, matId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_API_URL}/api/materials/${matId}`, { MaterialName: newName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefreshData(!refreshData);
        } catch (error) {
            toast.error(t("MaterialsTeacher.errorMessage"));
        }
    };

    const handleMaterialDelete = async (matId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/api/materials/${matId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefreshData(!refreshData);
        } catch (error) {
            toast.error(t("MaterialsTeacher.errorMessage"));
        }
    };

    const openAccessModalHandler = async (matId) => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/materials/studentsByMaterial/${matId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedMaterial(response.data);
        setIsAccessManagementModalOpened(true);
    };

    return (
        <div className='MaterialsTeacher mr-10 mt-3'>
            <AddMaterialModal
                isOpened={isAddMaterialModalOpened}
                onClose={() => { setIsAddMaterialModalOpened(false) }}
                onRefreshMaterials={() => { setRefreshData(!refreshData) }}
                teacherId={teacherId}
                parentId={nowParentId}
            />
            <AccessManagementModal
                isOpened={isAccessManagementModalOpened}
                courses={selectedMaterial.Courses}
                materialId={selectedMaterial.MaterialId}
                onClose={() => setIsAccessManagementModalOpened(false)}
            />

            <div className='my-[18px] items-center flex flex-wrap md:justify-between'>
                <div className="gap-2 flex">
                    <div className="button button-selected">
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="text-white text-[15px] font-bold font-['Nunito']">{t("MaterialsTeacher.archive")}</div>
                    </div>
                    <div className="px-4 py-2 bg-white text-[#8a48e6] rounded-[32px] border border-[#8a48e6] justify-start items-center gap-2 flex relative opacity-50 cursor-not-allowed">
                        <div className="absolute -top-2 -right-2 bg-[#8A48E6] text-white text-xs px-1.5 py-0.5 rounded-xl font-medium">
                            {t("MaterialsTeacher.soon")}
                        </div>
                        <div data-svg-wrapper>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">{t("MaterialsTeacher.store")}</div>
                    </div>
                </div>
                <div className="gap-2 flex w-full mt-2 md:w-auto md:mt-0">
                    <SearchButton onSearchClick={() => { setDir([]); }} value={searchValue} setValue={setSearchValue} />
                </div>
            </div>
            <div className='w-full flex flex-wrap md:justify-between'>
                <div className="gap-2 flex flex-wrap">
                    <ToggleSwitch isOn={isBlock} setIsOn={setIsBlock} />
                    <Dropdown categories={fileCategories} onSelect={(category) => setSelectedCategory(category)} />
                    <div className='button-wrapper flex items-center justify-start gap-2.5 rounded-full border border-[#8a48e6] bg-white hover:bg-[#8a48e6] px-3 py-2 stroke-[#8A48E6] hover:stroke-white text-[#8a48e6] hover:text-white cursor-pointer ml-3' onClick={() => { setIsAddMaterialModalOpened(true) }}>
                        <span className="icon-container flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 11V17M9 14H15M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <span className="justify-center text-[15px] font-bold font-['Nunito']">{t("MaterialsTeacher.addFile")}</span>
                    </div>
                    <div className='button-wrapper flex items-center justify-start gap-2.5 rounded-full border border-[#8a48e6] bg-white hover:bg-[#8a48e6] px-3 py-2 stroke-[#8A48E6] hover:stroke-white text-[#8a48e6] hover:text-white cursor-pointer' onClick={() => setShowFolderCreateBlock(true)}>
                        <span className="icon-container flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H9L12 7H19C19.5304 7 20.0391 7.21071 20.4142 7.58579C20.7893 7.96086 21 8.46957 21 9V12.5M16 19H22M19 16V22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <span className="justify-center text-[15px] font-bold font-['Nunito']">{t("MaterialsTeacher.createFolder")}</span>
                    </div>
                </div>
                <div className="gap-2 flex mt-2 md:mt-0">
                    <SortDropdown
                        options={[
                            t("MaterialsTeacher.sortAlphabetically"), 
                            t("MaterialsTeacher.sortNewest"), 
                            t("MaterialsTeacher.sortOldest")
                        ]}
                        onSelect={(option) => setSortOrder(option)}
                    />
                </div>
            </div>
            <div className='mt-6 ml-2 font-[Nunito] text-[15px] text-[#827FAE] font-bold'>
                {t("MaterialsTeacher.archive")}
                {
                    dir.map((d, index) =>
                        ' / ' + d
                    )
                }
            </div>
            <div className='w-full flex flex-wrap gap-4 mt-4 mb-8'>
                {!isSearching && currentFolder && (
                    <>
                        {isBlock ? (
                            <FolderUpBlock onClick={handleFolderUpClick} />
                        ) : (
                            <FolderUpList onClick={handleFolderUpClick} />
                        )}
                    </>
                )}
                {showFolderCreateBlock && (
                    <>{isBlock ? (<FolderCreateBlock
                        parentId={nowParentId}
                        teacherId={teacherId}
                        token={sessionStorage.getItem("token")}
                        setShowFolderCreateBlock={setShowFolderCreateBlock}
                        setRefreshData={setRefreshData}
                    />)
                        :
                        (<FolderCreateList
                            parentId={nowParentId}
                            teacherId={teacherId}
                            token={sessionStorage.getItem("token")}
                            setShowFolderCreateList={setShowFolderCreateBlock}
                            setRefreshData={setRefreshData}
                        />)}
                    </>
                )}
                {folders.map(folder => (
                    <>
                        {isBlock ? (
                            <FolderBlock
                                key={folder.MaterialId}
                                name={folder.MaterialName}
                                onClick={() => handleFolderClick(folder)}
                                folderId={folder.MaterialId}
                                onDelete={handleMaterialDelete}
                                onEdit={handleMaterialEdit}
                                openAccessModalHandler={() => openAccessModalHandler(folder.MaterialId)}
                            />
                        ) : (
                            <FolderList
                                key={folder.MaterialId}
                                name={folder.MaterialName}
                                onClick={() => handleFolderClick(folder)}
                                folderId={folder.MaterialId}
                                onDelete={handleMaterialDelete}
                                onEdit={handleMaterialEdit}
                                openAccessModalHandler={() => openAccessModalHandler(folder.MaterialId)}
                            />
                        )}
                    </>
                ))}
                {files.map(file => (
                    <>
                        {isBlock ? (
                            <MaterialBlock
                                key={file.MaterialId}
                                name={file.MaterialName}
                                ext={file.FilePath.split('.').pop()}
                                img={ImgValidFormats(file.FilePath)}
                                onDownloadClick={() => { onDownloadClick(file.FilePath); }}
                                materialId={file.MaterialId}
                                onDelete={handleMaterialDelete}
                                onEdit={handleMaterialEdit}
                                openAccessModalHandler={() => openAccessModalHandler(file.MaterialId)}
                            />
                        ) : (
                            <MaterialList
                                key={file.MaterialId}
                                name={file.MaterialName}
                                ext={file.FilePath.split('.').pop()}
                                img={ImgValidFormats(file.FilePath)}
                                onDownloadClick={() => { onDownloadClick(file.FilePath); }}
                                materialId={file.MaterialId}
                                onDelete={handleMaterialDelete}
                                onEdit={handleMaterialEdit}
                                openAccessModalHandler={() => openAccessModalHandler(file.MaterialId)}
                            />
                        )}
                    </>
                ))}
            </div>
        </div>
    );
}