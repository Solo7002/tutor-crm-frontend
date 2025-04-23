import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMaterialModal = ({ isOpened = false, onClose, onRefreshMaterials, teacherId, parentId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const MAX_FILE_SIZE = 49 * 1024 * 1024;
  const FORBIDDEN_EXTENSIONS = ['txt', 'bat'];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Файл "${file.name}" перевищує максимальний розмір (49MB)`);
      return { valid: false, reason: 'size', message: `Файл "${file.name}" перевищує максимальний розмір (49MB)` };
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (FORBIDDEN_EXTENSIONS.includes(extension)) {
      toast.error(`Файл "${file.name}" має заборонений формат (${extension})`);
      return { valid: false, reason: 'type', message: `Файл "${file.name}" має заборонений формат (${extension})` };
    }

    return { valid: true };
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validatedFiles = [];

    files.forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        validatedFiles.push({
          name: file.name,
          id: Date.now() + validatedFiles.length,
          file: file,
          status: 'pending'
        });
      }
    });

    setSelectedFiles([...selectedFiles, ...validatedFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== id));
    
    const newProgress = {...uploadProgress};
    delete newProgress[id];
    setUploadProgress(newProgress);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validatedFiles = [];

    files.forEach(file => {
      const validation = validateFile(file);
      
      if (validation.valid) {
        validatedFiles.push({
          name: file.name,
          id: Date.now() + validatedFiles.length,
          file: file,
          status: 'pending'
        });
      }
    });

    setSelectedFiles([...selectedFiles, ...validatedFiles]);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    const failedUploads = [];
    
    try {
      const uploadPromises = selectedFiles.map(async (fileObj) => {
        updateFileStatus(fileObj.id, 'loading');
        
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('Type', 'file');
        formData.append('MaterialName', fileObj.name);

        if (teacherId) formData.append('TeacherId', teacherId);
        if (parentId) formData.append('ParentId', parentId);

        try {
          const response = await axios.post('http://localhost:4000/api/materials', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(prev => ({
                ...prev,
                [fileObj.id]: percentCompleted
              }));
            }
          });
          
          updateFileStatus(fileObj.id, 'success');
          
          return response.data;
        } catch (error) {
          console.error(`Error uploading file ${fileObj.name}:`, error);
          updateFileStatus(fileObj.id, 'error');
          failedUploads.push(`Помилка завантаження файлу "${fileObj.name}": ${error.response?.data?.error || 'Невідома помилка'}`);
          throw error;
        }
      });

      await Promise.allSettled(uploadPromises);
      
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      onRefreshMaterials();

      toast.success("Матеріали успішно додані");
      
      if (failedUploads.length > 0) {
        sessionStorage.setItem('uploadErrors', JSON.stringify(failedUploads));
      }
      
      onClose();
      
      setTimeout(() => {
        const storedErrors = sessionStorage.getItem('uploadErrors');
        if (storedErrors) {
          const errors = JSON.parse(storedErrors);
          errors.forEach(error => {
            toast.error(error);
          });
          sessionStorage.removeItem('uploadErrors');
        }
        
        setSelectedFiles([]);
        setUploadProgress({});
        setIsUploading(false);
      }, 300);
    }
  };
  
  const updateFileStatus = (fileId, status) => {
    setSelectedFiles(files => 
      files.map(file => 
        file.id === fileId 
          ? { ...file, status } 
          : file
      )
    );
  };

  useEffect(() => {
    if (!isOpened) {
      const storedErrors = sessionStorage.getItem('uploadErrors');
      if (storedErrors) {
        const errors = JSON.parse(storedErrors);
        errors.forEach(error => {
          toast.error(error);
        });
        sessionStorage.removeItem('uploadErrors');
      }
    }
  }, [isOpened]);

  const getFileIcon = (status) => {
    switch(status) {
      case 'loading':
        return (
          <svg className="w-5 h-5 text-[#8a48e6] animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="#120C38" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z" stroke="#120C38" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isUploading ? onClose : undefined}
      />

      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl transform transition-all p-6 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#120c38] font-['Nunito']">Додати файл</h3>
          {!isUploading && (
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#120c38" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {!isUploading && (
          <>
            <div className="hover:underline mb-2">
              <label className="flex items-center cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M12 9V15M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="#8A48E6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[#8a48e6] text-sm font-['Mulish'] ml-2">
                  Обрати файл з комп'ютера
                </span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-xs text-[#827ead] font-['Mulish']">або</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div
              className={`border border-dashed border-[#827ead] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] mb-4 transition-colors
                ${isDragging ? 'bg-purple-50 border-[#8a48e6]' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M12 9V15M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="#827FAE" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <p className="text-center text-[#827ead] text-sm font-['Mulish'] mt-5">
                Перетягніть файли з комп'ютера у цю область
              </p>
              <p className="text-center text-[#827ead] text-xs font-['Mulish'] mt-2">
                Обмеження: макс. 49MB, без TXT або BAT файлів
              </p>
            </div>
          </>
        )}

        <div className="max-h-[200px] overflow-y-auto mb-4">
          {selectedFiles.map(file => (
            <div key={file.id} className="flex items-center py-2 group">
              {getFileIcon(file.status)}

              <span className="flex-grow text-sm text-[#120c38] font-['Mulish'] truncate ml-1">
                {file.name}
              </span>
              
              {file.status === 'loading' && uploadProgress[file.id] && (
                <div className="flex items-center">
                  <span className="text-xs text-[#8a48e6] mr-2">{uploadProgress[file.id]}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-[#8a48e6] h-1.5 rounded-full" 
                      style={{ width: `${uploadProgress[file.id]}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {file.status !== 'loading' && !isUploading && (
                <button
                  className="w-6 h-6 ml-2 flex items-center justify-center text-[#e64851] opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          {isUploading ? (
            <button
              className="bg-[#8a48e6] text-white px-4 py-2 rounded-full flex items-center font-bold font-['Nunito'] opacity-50 cursor-default"
              disabled
            >
              <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Завантаження...</span>
            </button>
          ) : (
            <button
              className={`bg-[#8a48e6] text-white px-4 py-2 rounded-full flex items-center font-bold font-['Nunito'] ${selectedFiles.length === 0 ? 'cursor-default opacity-50' : 'hover:bg-purple-700 cursor-pointer'}`}
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0}
            >
              <span>Додати файл(и)</span>
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal;