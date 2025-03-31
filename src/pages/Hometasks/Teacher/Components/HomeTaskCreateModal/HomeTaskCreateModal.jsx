import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import StandartInput from "../StandartInput/StandartInput";

const FileMarkup = ({ fileName, fileUrl }) => {
  return (
    <div className="w-full h-[75px] relative mt-2">
      <div className="w-full p-[15px] left-0 top-0 absolute bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#d7d7d7] inline-flex justify-start items-center gap-5">
        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.334 5.5V12.1667C23.334 12.6087 23.5096 13.0326 23.8221 13.3452C24.1347 13.6577 24.5586 13.8333 25.0007 13.8333H31.6673" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.334 35.5H11.6673C10.7833 35.5 9.93542 35.1488 9.31029 34.5237C8.68517 33.8986 8.33398 33.0507 8.33398 32.1667V8.83333C8.33398 7.94928 8.68517 7.10143 9.31029 6.47631C9.93542 5.85119 10.7833 5.5 11.6673 5.5H23.334L31.6673 13.8333V32.1667C31.6673 33.0507 31.3161 33.8986 30.691 34.5237C30.0659 35.1488 29.218 35.5 28.334 35.5Z" stroke="#827FAE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch justify-start text-[#120c38] text-[15px] font-normal font-['Mulish']">{fileName}</div>
        </div>
        <div className="mr-3">
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 17.5V19.5C4 20.0304 4.21071 20.5391 4.58579 20.9142C4.96086 21.2893 5.46957 21.5 6 21.5H18C18.5304 21.5 19.0391 21.2893 19.4142 20.9142C19.7893 20.5391 20 20.0304 20 19.5V17.5M7 11.5L12 16.5M12 16.5L17 11.5M12 16.5V4.5" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const HomeTaskCreateModal = ({ isOpened, onClose, subject = "", group = "", selectedGroupId, hometask = null, setRefreshTrigger }) => {
  // Ініціалізація станів
  const [deadline, setDeadline] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Визначення режиму: редагування або створення
  const isEditing = !!hometask;

  // Синхронізація станів при зміні hometask
  useEffect(() => {
    if (hometask) {
      setDeadline(hometask.HometaskDeadlineDate.split('T')[0]);
      setMaxScore(hometask.MaxMark.toString());
      setExistingFiles(hometask.HometaskFiles || []);
      setNewFiles([]); // Скидаємо нові файли при редагуванні
      setCoverImage(hometask.HometaskCover || null);
      setHeader(hometask.HometaskHeader || '');
      setDescription(hometask.HomeTaskDescription || '');
    } else {
      setDeadline('');
      setMaxScore('');
      setExistingFiles([]);
      setNewFiles([]);
      setCoverImage(null);
      setHeader('');
      setDescription('');
    }
  }, [hometask]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadCover(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/files/uploadAndReturnLink',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { fileUrl } = response.data;
      setNewFiles([...newFiles, { name: file.name, url: fileUrl }]);
    } catch (error) {
      console.error('Помилка при завантаженні файлу:', error);
      alert('Не вдалося завантажити файл');
    }
  };

  const uploadCover = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/files/uploadAndReturnLink',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const { fileUrl } = response.data;
      setCoverImage(fileUrl);
    } catch (error) {
      console.error('Помилка при завантаженні обкладинки:', error);
      alert('Не вдалося завантажити обкладинку');
    }
  };

  const isFormValid = () => {
    return (
      header.trim() !== '' &&
      description.trim() !== '' &&
      deadline !== '' &&
      new Date(deadline) > new Date() &&
      maxScore !== '' &&
      Number(maxScore) >= 0 &&
      Number(maxScore) <= 100
    );
  };

  const handleCreate = async () => {
    const currentDate = new Date().toISOString();
    const deadlineDate = new Date(deadline + 'T00:00:00Z').toISOString();

    const homeTaskData = {
      HomeTaskHeader: header,
      HomeTaskDescription: description,
      StartDate: currentDate,
      DeadlineDate: deadlineDate,
      MaxMark: parseInt(maxScore),
      ImageFilePath: coverImage,
      GroupId: selectedGroupId,
      files: newFiles.map(file => ({ FilePath: file.url, FileName: file.name }))
    };

    try {
      await axios.post('http://localhost:4000/api/hometasks', homeTaskData);
      onClose();
      setRefreshTrigger();
    } catch (error) {
      console.error('Помилка при створенні домашнього завдання:', error);
      alert('Не вдалося створити домашнє завдання');
    }
  };

  const handleEdit = async () => {
    const updatedHomeTaskData = {
      HomeTaskHeader: header,
      HomeTaskDescription: description,
      DeadlineDate: new Date(deadline + 'T00:00:00Z').toISOString(),
      MaxMark: parseInt(maxScore),
      ImageFilePath: coverImage,
      newFiles: newFiles.map(file => ({ FilePath: file.url, FileName: file.name })),
    };

    try {
      await axios.put(`http://localhost:4000/api/hometasks/${hometask.HometaskId}`, updatedHomeTaskData);
      onClose();
      setRefreshTrigger();
    } catch (error) {
      console.error('Помилка при редагуванні домашнього завдання:', error);
      alert('Не вдалося зберегти зміни');
    }
  };

  if (!isOpened) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <style>
        {`
        input[type="date"]::-webkit-calendar-picker-indicator {
          display: none;
        }
        input[type="date"] {
          -webkit-appearance: none;
          -moz-appearance: textfield;
          appearance: none;
        }
      `}
      </style>
      <div
        className="
          w-full
          max-w-[600px]
          bg-white
          rounded-3xl
          outline outline-1 outline-[#8a48e6]
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center" onClick={onClose}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7H15M1 7L7 13M1 7L7 1" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <h2 className="flex-1 text-center text-[#120c38] text-[15px] font-bold font-['Nunito']">
            {`${subject}, група ${group}`}
          </h2>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center"></div>
        </div>

        <div className="flex gap-4 p-4 flex-wrap md:flex-nowrap">
          <div
            className="
              relative
              bg-[#d7d7d7]
              rounded-3xl
              flex
              items-center
              justify-center
              w-full
              max-w-[182px]
              aspect-square
              mx-auto
              md:mx-0
              cursor-pointer
              group
            "
            onClick={() => coverInputRef.current.click()}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Обкладинка"
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.75 15.3333H28.7692M5.75 11.5C5.75 9.97501 6.3558 8.51247 7.43414 7.43414C8.51247 6.3558 9.97501 5.75 11.5 5.75H34.5C36.025 5.75 37.4875 6.3558 38.5659 7.43414C39.6442 8.51247 40.25 9.97501 40.25 11.5V34.5C40.25 36.025 39.6442 37.4875 38.5659 38.5659C37.4875 39.6442 36.025 40.25 34.5 40.25H11.5C9.97501 40.25 8.51247 39.6442 7.43414 38.5659C6.3558 37.4875 5.75 36.025 5.75 34.5V11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.75 30.6668L15.3333 21.0835C17.112 19.3719 19.3047 19.3719 21.0833 21.0835L30.6667 30.6668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26.833 26.8332L28.7497 24.9165C30.5283 23.2049 32.721 23.2049 34.4997 24.9165L40.2497 30.6665" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            )}
            <div
              className="
                absolute inset-0
                bg-black bg-opacity-50
                flex items-center justify-center
                rounded-3xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
            >
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28.75 15.3333H28.7692M5.75 11.5C5.75 9.97501 6.3558 8.51247 7.43414 7.43414C8.51247 6.3558 9.97501 5.75 11.5 5.75H34.5C36.025 5.75 37.4875 6.3558 38.5659 7.43414C39.6442 8.51247 40.25 9.97501 40.25 11.5V34.5C40.25 36.025 39.6442 37.4875 38.5659 38.5659C37.4875 39.6442 36.025 40.25 34.5 40.25H11.5C9.97501 40.25 8.51247 39.6442 7.43414 38.5659C6.3558 37.4875 5.75 36.025 5.75 34.5V11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.75 30.6668L15.3333 21.0835C17.112 19.3719 19.3047 19.3719 21.0833 21.0835L30.6667 30.6668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26.833 26.8332L28.7497 24.9165C30.5283 23.2049 32.721 23.2049 34.4997 24.9165L40.2497 30.6665" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <input
              type="file"
              ref={coverInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-[200px]">
            <div className="flex justify-between items-center p-2.5 rounded-2xl outline outline-1 outline-[#d7d7d7]">
              <span className="text-[#827ead] text-xs font-normal font-['Mulish']">
                Видано
              </span>
              <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1V5M5 1V5M1 9H17M4 12H4.013M7.01 12H7.015M10.01 12H10.015M13.015 12H13.02M10.015 15H10.02M4.01 15H4.015M7.01 15H7.015M1 5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V5Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-2.5 rounded-2xl outline outline-1 outline-[#827ead] flex justify-between items-center">
                <div className="flex flex-col">
                  <label
                    className="text-[#827ead] text-xs font-normal font-['Mulish']"
                    htmlFor="deadline"
                  >
                    Виконати до
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="
                      bg-transparent
                      text-[#827ead]
                      text-[15px]
                      font-normal font-['Mulish']
                      outline-none
                      border-none
                      p-0
                      mt-1
                    "
                    placeholder="-- -- ----"
                  />
                </div>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 12.5L10 10.5V5.5M1 10.5C1 11.6819 1.23279 12.8522 1.68508 13.9442C2.13738 15.0361 2.80031 16.0282 3.63604 16.864C4.47177 17.6997 5.46392 18.3626 6.55585 18.8149C7.64778 19.2672 8.8181 19.5 10 19.5C11.1819 19.5 12.3522 19.2672 13.4442 18.8149C14.5361 18.3626 15.5282 17.6997 16.364 16.864C17.1997 16.0282 17.8626 15.0361 18.3149 13.9442C18.7672 12.8522 19 11.6819 19 10.5C19 9.3181 18.7672 8.14778 18.3149 7.05585C17.8626 5.96392 17.1997 4.97177 16.364 4.13604C15.5282 3.30031 14.5361 2.63738 13.4442 2.18508C12.3522 1.73279 11.1819 1.5 10 1.5C8.8181 1.5 7.64778 1.73279 6.55585 2.18508C5.46392 2.63738 4.47177 3.30031 3.63604 4.13604C2.80031 4.97177 2.13738 5.96392 1.68508 7.05585C1.23279 8.14778 1 9.3181 1 10.5Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div className="flex-1 p-2.5 rounded-2xl outline outline-1 outline-[#d7d7d7] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#d7d7d7] text-xs font-normal font-['Mulish']">
                    Виконано
                  </span>
                  <span className="text-[#d7d7d7] text-[15px] font-bold font-['Nunito']">
                    -- -- ----
                  </span>
                </div>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6L6 11L16 1" stroke="#D7D7D7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-[177px] p-2.5 rounded-2xl outline outline-1 outline-[#827ead] flex justify-between items-center">
                <div className="flex flex-col">
                  <label
                    className="text-[#827ead] text-xs font-normal font-['Mulish']"
                    htmlFor="maxScore"
                  >
                    Максимальний бал
                  </label>
                  <input
                    id="maxScore"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="
                      w-12
                      bg-transparent
                      text-[#827ead]
                      text-[15px]
                      font-normal font-['Mulish']
                      outline-none
                      border-none
                      p-0
                      mt-1
                    "
                    placeholder="--"
                  />
                </div>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9998 18.25L5.82784 21.495L7.00684 14.622L2.00684 9.75495L8.90684 8.75495L11.9928 2.50195L15.0788 8.75495L21.9788 9.75495L16.9788 14.622L18.1578 21.495L11.9998 18.25Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div className="flex-1 w-[177px] p-2.5 rounded-2xl outline outline-1 outline-[#d7d7d7] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#827ead] text-xs font-normal font-['Mulish']">
                    Статус
                  </span>
                  <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                    {isEditing ? 'Редагування' : 'Створення'}
                  </span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pb-0 flex-1">
          <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] mb-3 ml-3">
            Завдання
          </h3>
          <StandartInput
            placeholder={"Завдання"}
            value={header}
            onChange={(e) => setHeader(e.target.value)}
          />
          <StandartInput
            placeholder={"Опис"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="p-4 pt-0">
          <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] ml-3">
            Прикріплені файли
          </h3>
          <div className="w-full h-[160px] overflow-x-auto whitespace-nowrap">
            {[...existingFiles, ...newFiles].map((file, index) => (
              <FileMarkup
                key={index}
                fileName={file.FileName || file.name}
                fileUrl={file.Filepath || file.url}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between p-4 gap-2">
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="
                flex items-center justify-center gap-2.5
                bg-white
                rounded-[40px]
                outline outline-1 outline-[#d7d7d7]
                px-4 py-2
                transition
                hover:bg-gray-100
              "
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66699 16.0003H25.3337M16.0003 6.66699V25.3337" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <span className="text-[#120c38] text-[15px] font-bold font-['Nunito']">
                Додати файли
              </span>
            </button>
          </div>
          <div className="w-[138px] h-12 relative">
            <div
              onClick={isFormValid() ? (isEditing ? handleEdit : handleCreate) : null}
              className={`w-[138px] h-12 p-2 left-0 top-0 absolute rounded-[40px] inline-flex justify-end items-center gap-2.5 cursor-pointer ${
                isFormValid()
                  ? 'bg-[#8a48e6] hover:bg-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="justify-center text-white text-[15px] font-bold font-['Nunito']">
                {isEditing ? 'Зберегти' : 'Надіслати'}
              </div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.9999 15.9997L6.26391 5.37835C6.13992 5.33013 6.00433 5.3201 5.8746 5.34956C5.74486 5.37903 5.62691 5.44663 5.53591 5.54369C5.44258 5.64325 5.37832 5.76648 5.35011 5.9C5.3219 6.03352 5.33082 6.17222 5.37591 6.30102L8.66658 15.9997M27.9999 15.9997L6.26391 26.621C6.13992 26.6692 6.00433 26.6793 5.8746 26.6498C5.74486 26.6203 5.62691 26.5527 5.53591 26.4557C5.44258 26.3561 5.37832 26.2329 5.35011 26.0994C5.3219 25.9659 5.33082 25.8272 5.37591 25.6984L8.66658 15.9997M27.9999 15.9997H8.66658" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskCreateModal;