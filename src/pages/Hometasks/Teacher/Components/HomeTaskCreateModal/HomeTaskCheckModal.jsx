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

const DoneFileMarkup = ({ fileName, fileUrl }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Кнопка скачивания */}
      <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17M7 11L12 16M12 16L17 11M12 16V4" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
      {/* Название файла */}
      <div className="text-[#8a48e6] text-[15px] font-semibold font-['Lato'] flex-grow">
        {fileName}
      </div>
      {/* Иконка файла */}
      <div className="">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z" stroke="#8A48E6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const HomeTaskCheckModal = ({ isOpened, onClose, hometask = null, doneHometask = null, subject = null, group = null, onEvaluate, onEvaluateAI }) => {
  const [coverImage, setCoverImage] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

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
              group
            "
          >
            <img
              src={hometask.HometaskCover}
              alt="Обкладинка"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-[200px]">
            <div className="flex justify-between items-center p-2.5 rounded-2xl outline outline-1 outline-[#d7d7d7]">
              <span className="text-[#827ead] text-xs font-normal font-['Mulish']">
                Видано
              </span>
              <span className="text-[#120C38] text-[15px] font-bold font-['Nunito']">
                {new Date(hometask.HometaskStartDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
                  <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                    {new Date(hometask.HometaskDeadlineDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 12.5L10 10.5V5.5M1 10.5C1 11.6819 1.23279 12.8522 1.68508 13.9442C2.13738 15.0361 2.80031 16.0282 3.63604 16.864C4.47177 17.6997 5.46392 18.3626 6.55585 18.8149C7.64778 19.2672 8.8181 19.5 10 19.5C11.1819 19.5 12.3522 19.2672 13.4442 18.8149C14.5361 18.3626 15.5282 17.6997 16.364 16.864C17.1997 16.0282 17.8626 15.0361 18.3149 13.9442C18.7672 12.8522 19 11.6819 19 10.5C19 9.3181 18.7672 8.14778 18.3149 7.05585C17.8626 5.96392 17.1997 4.97177 16.364 4.13604C15.5282 3.30031 14.5361 2.63738 13.4442 2.18508C12.3522 1.73279 11.1819 1.5 10 1.5C8.8181 1.5 7.64778 1.73279 6.55585 2.18508C5.46392 2.63738 4.47177 3.30031 3.63604 4.13604C2.80031 4.97177 2.13738 5.96392 1.68508 7.05585C1.23279 8.14778 1 9.3181 1 10.5Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div className="flex-1 p-2.5 rounded-2xl outline outline-1 outline-[#8A48E6] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#827FAE] text-xs font-normal font-['Mulish']">
                    Виконано
                  </span>
                  <span className="text-[#8A48E6] text-[15px] font-bold font-['Nunito']">
                    {new Date(doneHometask.DoneDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 3.33989C18.5083 4.21075 19.7629 5.46042 20.6398 6.96519C21.5167 8.46997 21.9854 10.1777 21.9994 11.9192C22.0135 13.6608 21.5725 15.3758 20.72 16.8946C19.8676 18.4133 18.6332 19.6831 17.1392 20.5782C15.6452 21.4733 13.9434 21.9627 12.2021 21.998C10.4608 22.0332 8.74055 21.6131 7.21155 20.7791C5.68256 19.9452 4.39787 18.7264 3.48467 17.2434C2.57146 15.7604 2.06141 14.0646 2.005 12.3239L2 11.9999L2.005 11.6759C2.061 9.94888 2.56355 8.26585 3.46364 6.79089C4.36373 5.31592 5.63065 4.09934 7.14089 3.25977C8.65113 2.42021 10.3531 1.98629 12.081 2.00033C13.8089 2.01437 15.5036 2.47589 17 3.33989ZM15.707 9.29289C15.5348 9.12072 15.3057 9.01729 15.0627 9.002C14.8197 8.98672 14.5794 9.06064 14.387 9.20989L14.293 9.29289L11 12.5849L9.707 11.2929L9.613 11.2099C9.42058 11.0607 9.18037 10.9869 8.9374 11.0022C8.69444 11.0176 8.46541 11.121 8.29326 11.2932C8.12112 11.4653 8.01768 11.6943 8.00235 11.9373C7.98702 12.1803 8.06086 12.4205 8.21 12.6129L8.293 12.7069L10.293 14.7069L10.387 14.7899C10.5624 14.926 10.778 14.9998 11 14.9998C11.222 14.9998 11.4376 14.926 11.613 14.7899L11.707 14.7069L15.707 10.7069L15.79 10.6129C15.9393 10.4205 16.0132 10.1802 15.9979 9.93721C15.9826 9.69419 15.8792 9.46509 15.707 9.29289Z" fill="#8A48E6" />
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
                  <span className="text-[#120C38] text-[15px] font-bold font-['Nunito']">
                    {hometask.MaxMark}
                  </span>
                </div>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9998 18.25L5.82784 21.495L7.00684 14.622L2.00684 9.75495L8.90684 8.75495L11.9928 2.50195L15.0788 8.75495L21.9788 9.75495L16.9788 14.622L18.1578 21.495L11.9998 18.25Z" stroke="#827FAE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              <div className="flex-1 w-[177px] p-2.5 rounded-2xl outline outline-1 outline-[#FFA869] flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[#827ead] text-xs font-normal font-['Mulish']">
                    Статус
                  </span>
                  <span className="text-[#FFA869] text-[15px] font-bold font-['Nunito']">
                    До перевірки
                  </span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955" stroke="#FFA869" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pb-0 flex-1  mb-3 ml-3">
          <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">
            Завдання
          </h3>
          <div className='font-[Mulish] text-[20px] text-[#120C38] font-normal'>{hometask.HometaskHeader}</div>
          <div className='font-[Mulish] text-[15px] text-[#827FAE] font-normal'>{hometask.HomeTaskDescription}</div>
        </div>

        <div className="p-4 pt-0">
          <h3 className="text-[#8a48e6] text-[15px] font-bold font-['Nunito'] ml-3 mb-1">
            Прикріплені файли
          </h3>
          <div className="w-full h-[140px] overflow-x-auto whitespace-nowrap">
            {hometask.HometaskFiles.map((file, index) => (
              <FileMarkup
                key={index}
                fileName={file.FileName || file.name}
                fileUrl={file.Filepath || file.url}
              />
            ))}
          </div>
        </div>

        <div className="p-4 pb-0 flex-1 mb-3 ml-3">
          <span className="text-[#8a48e6] text-[15px] font-bold font-['Nunito']">Завдання від: </span>
          <span className="text-[#827FAE] text-[15px] font-bold font-['Nunito']">{doneHometask.Student.LastName + " " + doneHometask.Student.FirstName}</span>

          <div className="flex flex-wrap gap-4 bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-[#8a48e6] px-4 py-3 mt-1">
            {doneHometask.DoneHometaskFiles.map((file, index) => (
              <DoneFileMarkup
              key={index}
              fileName={file.FileName || file.name}
              fileUrl={file.Filepath || file.url}
            />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between p-4 gap-2">
          <div data-icon-position="Right" data-property-1="Active" data-size="Big" data-text-or without="On" className="w-[240px] h-12 p-2 bg-[#8a48e6] hover:bg-purple-700 rounded-[40px] inline-flex justify-between items-center cursor-pointer" onClick={onEvaluateAI}>
            <div className="justify-center text-white text-[15px] font-bold font-['Nunito']">Автоматичне оцінювання</div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6667 21.3333V13.3333C10.6667 12.6261 10.9476 11.9478 11.4477 11.4477C11.9478 10.9476 12.6261 10.6667 13.3333 10.6667C14.0406 10.6667 14.7189 10.9476 15.219 11.4477C15.7191 11.9478 16 12.6261 16 13.3333V21.3333M10.6667 17.3333H16M21.3333 10.6667V21.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div data-icon-position="Right" data-property-1="Secondary" data-size="Big" data-text-or without="On" className="w-[178px] h-12 p-2.5 bg-white hover:bg-[#8a48e6] rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#8a48e6] inline-flex justify-end items-center gap-2.5 cursor-pointer text-[#8a48e6] hover:text-white stroke-[#8A48E6] hover:stroke-white" onClick={onEvaluate}>
            <div className="justify-center text-[15px] font-bold font-['Nunito']">Оцінити вручну</div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 16L6.264 5.37867C6.14001 5.33044 6.00442 5.32041 5.87469 5.34988C5.74495 5.37934 5.627 5.44695 5.536 5.544C5.44267 5.64356 5.37841 5.76679 5.3502 5.90031C5.32199 6.03383 5.33092 6.17253 5.376 6.30133L8.66667 16M28 16L6.264 26.6213C6.14001 26.6696 6.00442 26.6796 5.87469 26.6501C5.74495 26.6207 5.627 26.553 5.536 26.456C5.44267 26.3564 5.37841 26.2332 5.3502 26.0997C5.32199 25.9662 5.33092 25.8275 5.376 25.6987L8.66667 16M28 16H8.66667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskCheckModal;