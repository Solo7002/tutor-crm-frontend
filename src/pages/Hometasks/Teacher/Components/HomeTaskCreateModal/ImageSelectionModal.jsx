import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';


const ImageSelectionModal = ({ isOpen, onClose, onSelectImage, groupId }) => {
  const { t } = useTranslation();
  const [lastUsedImage, setLastUsedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  
  const token = sessionStorage.getItem('token');

  const standardCovers = [
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_1.png',
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_2.png',
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_3.png',
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_4.png',
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_5.png',
    'https://blobstorage226122007.blob.core.windows.net/blob-storage-container/hometask13042025_cover_6.png'
  ];

  useEffect(() => {
    if (groupId) {
      fetchLastUsedImage();
    }
  }, [groupId]);

  const fetchLastUsedImage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/hometasks/getLastImageByGroupId/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLastUsedImage(response.data.imagePath);
    } catch (error) {
      
      toast.error(t('HomeTaskTeacher.components.ImageSelectionModal.FetchLastImageError'), {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/files/uploadAndReturnLink`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const { fileUrl } = response.data;
      setSelectedImage(fileUrl);
      onSelectImage(fileUrl);
      onClose();
    } catch (error) {
 
      toast.error(t('HomeTaskTeacher.components.ImageSelectionModal.FileUploadError'), {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCover = (imageUrl) => {
    setSelectedImage(imageUrl);
    onSelectImage(imageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div
        className="
          w-full
          max-w-[600px]
          bg-white
          rounded-3xl
          outline outline-1 outline-[#8a48e6]
          flex flex-col
          max-h-[90vh]
          overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-white z-10 border-b border-gray-100">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center" onClick={onClose}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7H15M1 7L7 13M1 7L7 1" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <h2 className="flex-1 text-center text-[#120c38] text-[15px] font-bold font-['Nunito'] truncate px-2">
            {t('HomeTaskTeacher.components.ImageSelectionModal.Title')}
          </h2>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"></div>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] mb-3 ml-1">
              {t('HomeTaskTeacher.components.ImageSelectionModal.UploadFromComputer')}
            </h3>
            <button
              onClick={() => fileInputRef.current.click()}
              className="
                w-full
                p-4
                border-2
                border-dashed
                border-[#d7d7d7]
                rounded-xl
                flex
                flex-col
                items-center
                justify-center
                gap-2
                hover:bg-gray-50
                transition
              "
            >
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.75 15.3333H28.7692M5.75 11.5C5.75 9.97501 6.3558 8.51247 7.43414 7.43414C8.51247 6.3558 9.97501 5.75 11.5 5.75H34.5C36.025 5.75 37.4875 6.3558 38.5659 7.43414C39.6442 8.51247 40.25 9.97501 40.25 11.5V34.5C40.25 36.025 39.6442 37.4875 38.5659 38.5659C37.4875 39.6442 36.025 40.25 34.5 40.25H11.5C9.97501 40.25 8.51247 39.6442 7.43414 38.5659C6.3558 37.4875 5.75 36.025 5.75 34.5V11.5Z" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.75 30.6668L15.3333 21.0835C17.112 19.3719 19.3047 19.3719 21.0833 21.0835L30.6667 30.6668" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26.833 26.8332L28.7497 24.9165C30.5283 23.2049 32.721 23.2049 34.4997 24.9165L40.2497 30.6665" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span className="text-[#827FAE] text-sm">{t('HomeTaskTeacher.components.ImageSelectionModal.SelectImage')}</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </button>
          </div>

          {lastUsedImage && (
            <div className="mb-6">
              <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] mb-3 ml-1">
                {t('HomeTaskTeacher.components.ImageSelectionModal.LastUsedImage')}
              </h3>
              <div className="w-[173px] mx-auto grid grid-cols-1 gap-4">
                <div 
                  className="
                    aspect-square
                    rounded-xl
                    overflow-hidden
                    cursor-pointer
                    relative
                    group
                    outline
                    outline-1
                    outline-[#d7d7d7]
                  "
                  onClick={() => handleSelectCover(lastUsedImage)}
                >
                  <img 
                    src={lastUsedImage} 
                    alt={t('HomeTaskTeacher.components.ImageSelectionModal.LastUsedImageAlt')} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="
                      absolute 
                      inset-0 
                      bg-black 
                      bg-opacity-50 
                      opacity-0 
                      group-hover:opacity-100 
                      transition-opacity 
                      duration-300
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span className="text-white font-bold">{t('HomeTaskTeacher.components.ImageSelectionModal.Select')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] mb-3 ml-1">
              {t('HomeTaskTeacher.components.ImageSelectionModal.StandardCovers')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {standardCovers.map((cover, index) => (
                <div 
                  key={index} 
                  className="
                    aspect-square
                    rounded-xl
                    overflow-hidden
                    cursor-pointer
                    relative
                    group
                    outline
                    outline-1
                    outline-[#d7d7d7]
                  "
                  onClick={() => handleSelectCover(cover)}
                >
                  <img 
                    src={cover} 
                    alt={`${t('HomeTaskTeacher.components.ImageSelectionModal.StandardCoverAlt')} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="
                      absolute 
                      inset-0 
                      bg-black 
                      bg-opacity-50 
                      opacity-0 
                      group-hover:opacity-100 
                      transition-opacity 
                      duration-300
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span className="text-white font-bold">{t('HomeTaskTeacher.components.ImageSelectionModal.Select')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-[#8a48e6] border-t-transparent rounded-full animate-spin"></div>
              <span>{t('HomeTaskTeacher.components.ImageSelectionModal.Loading')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelectionModal;