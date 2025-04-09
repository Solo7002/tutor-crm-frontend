import './HometaskModal.css'
import HometaskDownloadFile from "../HometaskDownloadFile/HometaskDownloadFile";
import HometaskDoneItem from "../HometaskDoneItem/HometaskDoneItem";
import { useState, useRef, useEffect } from 'react';
import { StatusButton } from '../HomeCard/Hometask-card';
import { BlackButton } from '../../../../components/Buttons/Buttons';
import { formatDate } from '../../../../functions/formatDate';
import HometaskDoneItemDownload from '../HometaskDoneItemDownload/HometaskDoneItemDownload';
import axios from 'axios';

export const HometaskModal = ({ onClose, status, token, hometask, hometaskFiles, hometaskDone = null, hometaskDoneFiles, studentId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [fileUrls, setFileUrls] = useState({});
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };
  const sendHometask = async () => {
    try {

      // создаем и получаем id doneHometask,для подальшего создания файлов
      const createDoneHometaskResponse = await axios.post(
        'http://localhost:4000/api/doneHometasks',
        {
          HomeTaskId: hometask.HomeTaskId,
          StudentId: studentId,
          DoneDate: new Date().toISOString(),
          Mark: -1
        }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      const doneHometaskId = createDoneHometaskResponse.data.DoneHomeTaskId;

      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          console.log("FormData:", formData);

          const uploadResponse = await axios.post(
            'http://localhost:4000/api/files/uploadAndReturnLink',
            formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          );


          return {
            name: file.name,
            url: uploadResponse.data.fileUrl
          };
        })
      )

      await Promise.all(
        uploadedFiles.map(async (file) => {
          await axios.post(
            'http://localhost:4000/api/doneHometaskFiles/',
            {
              DoneHomeTaskId: doneHometaskId,
              FileName: file.name,
              FilePath: file.url
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        })
      )
      alert('Домашнє завдання успішно відправлено!');
      onClose();
    } catch (error) {
      console.log("Send hometask error:", error)
    }


  }

  const downloadFile = async (FileName) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/files/download/${FileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        }
      );
      const url = response.data.url;
      if (url)
        return url.toString();

      return null;



    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  const cancellationOfHomework = async () => {
    if (hometaskDone) {
      await axios.delete(`http://localhost:4000/api/doneHometasks/${hometaskDone.DoneHomeTaskId}`, { headers: { Authorization: `Bearer ${token}` } });
      onClose();
    }

  }

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "На перевірці";
      case "done":
        return "Виконано";
      default:
        return "До виконання";
    }
  };

  const getBorderStatusColor = () => {
    switch (status) {
      case "pending":
        return "border-[#FFA869]";
      case "done":
        return "border-[#44B56A]";
      default:
        return "border-[#d7d7d7]";
    }
  };
  const getColorTextStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-[#FFA869]";
      case "done":
        return "text-[#44B56A]";
      default:
        return "text-black";
    }
  };
  const handleRemoveFile = (index) => {
    console.log(index);

    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchFileUrls = async () => {
      const urls = {};
      for (const file of hometaskFiles) {
        try {
          const url = await downloadFile(file.FileName);
          urls[file.HomeTaskFileId] = url;
        } catch (error) {
          console.error(`Ошибка при загрузке файла ${file.FileName}:`, error);
          urls[file.HomeTaskFileId] = null;  
        }
      }
      setFileUrls(urls);
    };

    fetchFileUrls();
  }, [hometaskFiles, token]);

  const [fileUrlsDoneHomeTask, setFileUrlsDoneHomeTask] = useState({});

  useEffect(() => {
    const fetchFileUrlsDoneHomeTask = async () => {
      if (!hometaskDoneFiles || hometaskDoneFiles.length === 0) return;

      const urls = {};
      for (const file of hometaskDoneFiles) {
        try {
       

          urls[file.HometaskFileId] = file.FilePath;
        } catch (error) {
          console.error(`Ошибка при загрузке файла ${file.FileName}:`, error);
          urls[file.HometaskFileId] = null;
        }
      }
      setFileUrlsDoneHomeTask(urls);
    };

    fetchFileUrlsDoneHomeTask();
  }, [hometaskDoneFiles, token]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 w-[596px] h-[851px] overflow-y-auto z-50">
       
        <div className="flex justify-between items-center">
          <button onClick={onClose}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="20" fill="white" />
              <path d="M13 20H27M13 20L19 26M13 20L19 14" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h2 className="text-gray-900 font-bold text-center font-['Nunito'] text-[15px]">Завдання | {hometask.subjectName}</h2>

          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="white" />
            <path d="M27 12V28H15C14.4696 28 13.9609 27.7893 13.5858 27.4142C13.2107 27.0391 13 26.5304 13 26V14C13 13.4696 13.2107 12.9609 13.5858 12.5858C13.9609 12.2107 14.4696 12 15 12H27Z" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M27 24H15C14.4696 24 13.9609 24.2107 13.5858 24.5858C13.2107 24.9609 13 25.4696 13 26M17 16H23" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Основной контент */}
        <div className="flex items-start gap-4 mt-4">
          {/* Изображение */}
          <img src={hometask.ImageFilePath} alt="Task" className="w-[182px] h-[182px] rounded-[24px] object-cover" />

          {/* Блок с кнопками */}
          <div className="">
            {/* Видано */}
            <div className="w-[344px] h-14 p-2.5 rounded-2xl border border-[#d7d7d7] flex justify-between items-center m-1">
              <div className="w-28 h-8">
                <div className="text-[#827ead] text-xs font-normal font-['Mulish']">Видано</div>
                <div className="text-[#120c38] text-base font-bold font-['Nunito']">{formatDate(hometask.StartDate)}</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="grid grid-cols-2">


              {/* Виконати до */}
              <div className="w-[167px] h-14 p-2.5 rounded-2xl border border-[#8a48e6] flex justify-between items-center m-1">
                <div className="w-28 h-8">
                  <div className="text-[#827ead] text-xs font-normal font-['Mulish']">Виконати до</div>
                  <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{formatDate(hometask.DeadlineDate)}</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z" stroke="#8A48E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Виконано */}
              <div className="w-[167px] h-14 p-2.5 rounded-2xl border border-[#d7d7d7] flex justify-between items-center m-1">
                <div className="w-28 h-8">
                  <div className="text-[#827ead] text-xs font-normal font-['Mulish']">Виконано</div>
                  <div className="text-[#120c38]  font-bold font-['Nunito'] text-[15px]">{status === "done" ? formatDate(hometaskDone.DoneDate) : '-- -- ----'}</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L20 7" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Максимальний бал */}
              <div className="w-[167px] h-14 p-2.5 rounded-2xl border border-[#d7d7d7] flex justify-between items-center m-1">
                <div className="w-28 h-8">
                  <div className="text-[#827ead] text-[11px] font-normal font-['Mulish']">Максимальний бал</div>
                  <div className="text-[#120c38]  font-bold font-['Nunito'] text-[15px]">{hometask.MaxMark}</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.75L5.82799 20.995L7.00699 14.122L2.00699 9.255L8.90699 8.255L11.993 2.002L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Статус */}
              <div className={`w-[167px] h-14 p-2.5 rounded-2xl border ${getBorderStatusColor()} flex justify-between items-center`}>
                <div className="w-28 h-8">
                  <div className={`text-[#827ead] text-xs font-normal font-['Mulish'] `}>Статус</div>
                  <div className={`font-bold font-['Nunito'] text-[15px] ${getColorTextStatusColor()}`}>
                    {getStatusText()}
                  </div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="w-96 h-  p-4 flex flex-col gap-2 ">
          <div className="flex flex-col gap-2">
            <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">
              Завдання
            </div>
            <div className="text-[#120c38] w-[536px]  font-normal font-['Mulish'] text-[15px] overflow-y-auto">
              {hometask.HomeTaskDescription}
            </div>
          </div>
        </div>

        <div className="w-[536px] h-64 flex-col justify-start items-start p-4 gap-4 inline-flex">
          <div className="self-stretch h-4 text-[#8a48e6] text-base font-bold font-['Nunito']">Прикріплені файли</div>
          <div className="w-[536px] h-[200px]   overflow-y-auto  flex-col justify-start  items-start p-4 gap-4 inline-flex">
            {hometaskFiles.map((file) => (
              <HometaskDownloadFile
                key={file.HomeTaskFileId}
                title={file.FileName}
                format={file.format}
                fileLink={fileUrls[file.HomeTaskFileId]}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap flex-row h-24 overflow-y-auto">

          {status === "default" && selectedFiles.map((file, index) => (
            <HometaskDoneItem key={index} text={file.name} onClick={() => handleRemoveFile(index)} />
          ))}

          {(status === "done" || status === "pending") && hometaskDoneFiles && hometaskDoneFiles.map((file, index) => (
            <HometaskDoneItemDownload
              key={index}
              text={file.FileName}
              fileLink={fileUrlsDoneHomeTask[file.HometaskFileId]}
            />
          ))}



        </div>
        <div className="absolute bottom-5 left-0 right-0 px-4">
          <div className="flex justify-between items-center">
            {status === "done" && hometaskDone && (
              <div className='text-[#8a48e6]'>
                Оцінка: {hometaskDone.Mark}/{hometask.MaxMark}
              </div>
            )}
            {status === "default" && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, application/pdf"
                  multiple
                />
                <BlackButton className="w-36 h-11 px-4 py-2" onClick={() => fileInputRef.current.click()}>
                  Обрати
                </BlackButton>
                <StatusButton status={status} className="w-56 h-11 px-4 py-2 flex" onClick={sendHometask} /></>
            )}
            {status === "pending" && (
              <>
                <BlackButton className="w-36 h-11 px-4 py-2" disabled={true}>
                  Обрати
                </BlackButton>
                <StatusButton status={status} className="w-56 h-11 px-4 py-2 flex" onClick={cancellationOfHomework} /></>
            )}

          </div>
        </div>

      </div>

    </>
  );
}