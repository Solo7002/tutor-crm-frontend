import React, { useState } from 'react';

const TestModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-[20px] shadow-lg w-[460px] h-[420px]">
          <div className="p-5 h-full flex flex-col">
            {/* Header */}
            <div className="relative mb-4 h-10">
              {/* Иконка слева */}
              <div className="absolute left-0 top-0">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="20" fill="white" />
                  <path
                    d="M13 20H27M13 20L19 26M13 20L19 14"
                    stroke="#120C38"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Заголовок по центру */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-[#120C38] text-[15px] font-bold font-[Nunito]">
                  Тест | Математика
                </h2>
              </div>
            </div>

            {/* Блок с информационными полями */}
            <div className="space-y-4">
              {/* 1 ряд: Видано */}
              <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 h-[54px]">
                <div>
                  <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                    Видано
                  </div>
                  <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                    03.04.2025
                  </div>
                </div>
                <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
                      stroke="#827FAE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* 2 ряд: Виконати до и Виконано */}
              <div className="flex gap-5">
                {/* Виконати до */}
                <div className="flex justify-between items-center border border-[#8a48e6] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      Виконати до
                    </div>
                    <div className="text-[15px] text-[#8a48e6] font-bold font-[Nunito]">
                      03.04.2025
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 14L12 12V7M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                        stroke="#8A48E6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Виконано */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      Виконано
                    </div>
                    <div className="text-[15px] text-[#827ead] font-bold font-[Nunito]">
                      -- -- ----
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 3 ряд: Максимальний бал и Статус */}
              <div className="flex gap-5">
                {/* Максимальний бал */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      Максимальний бал
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      12
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.75L5.828 20.995L7.007 14.122L2.007 9.255L8.907 8.255L11.993 2.002L15.079 8.255L21.979 9.255L16.979 14.122L18.158 20.995L12 17.75Z"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Статус */}
                <div className="flex justify-between items-center border border-[#d7d7d7] rounded-2xl p-2.5 w-[200px] h-[54px]">
                  <div>
                    <div className="text-xs text-[#827ead] font-normal font-[Mulish]">
                      Статус
                    </div>
                    <div className="text-[15px] text-[#120C38] font-bold font-[Nunito]">
                      До виконання
                    </div>
                  </div>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9949 19.9786V20M11.9949 13.559C12.8928 13.5619 13.7655 13.2403 14.4719 12.6462C15.1783 12.0521 15.6773 11.2201 15.8883 10.2846C16.0992 9.34912 16.0098 8.36475 15.6345 7.49044C15.2591 6.61612 14.6198 5.90292 13.8197 5.46599C13.0254 5.0299 12.1169 4.89469 11.2418 5.08235C10.3667 5.27001 9.57658 5.76949 9 6.49955"
                        stroke="#827FAE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Нижняя информационная панель */}
            <div className="mt-4 space-y-2 px-2">
              <div className="flex justify-between">
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    Кількість спроб:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    2
                  </span>
                </div>
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    Виконано спроб:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    0/2
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    Час на виконання:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    30хв
                  </span>
                </div>
                <div>
                  <span className="text-[15px] text-black font-bold font-[Nunito] mr-2">
                    Кількість питань:
                  </span>
                  <span className="text-[15px] text-[#827ead] font-normal font-[Mulish]">
                    12
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопка */}
            <button
              className="mt-auto w-full bg-[#8a4ae6] text-white text-xl font-medium font-[Nunito] rounded-2xl py-2"
              onClick={() => console.log('Кнопка нажата')}
            >
              До виконання
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestModal;
