import React from 'react';
import './TestItem.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../../functions/formatDate';
import { encryptData } from '../../../../utils/crypto';

const TestItem = ({ test }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getTestType = () => {
    return 'default';
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'default': return '#e0e0e0';
      case 'overdue': return '#e64851';
      case 'done_good': return '#47c974';
      case 'done_medium': return '#ffa869';
      case 'done_bad': return '#e64851';
      default: return '#e0e0e0';
    }
  };

  const handleViewTestInfo = () => {
    const encryptedTestId = encryptData(test.TestId);
    navigate(`results/${encryptedTestId}`);
  };

  const type = getTestType();

  return (
    <div
      className="relative w-full p-4 rounded-3xl border flex-col justify-start items-start gap-4 inline-flex pattern-bg"
      style={{
        backgroundImage: 'linear-gradient(to top right, white, transparent)',
        border: `1px solid ${getBorderColor(type)}`,
      }}
    >
      {/* Subject and Teacher */}
      <div className="self-stretch flex-col justify-start items-start gap-2 flex">
        <div className="self-stretch justify-start items-center gap-2 inline-flex flex-wrap">
          <div className="grow shrink basis-0 h-6 text-[#827ead] text-[15px] font-bold font-['Nunito'] truncate">
            {test.CourseName}
          </div>
          <div className="text-right text-[#827ead] text-[15px] font-bold font-['Nunito']">
            {test.UserLastName} {test.UserFirstName && test.UserFirstName.charAt(0) + '.'}
          </div>
        </div>
        <div className="self-stretch text-[#120c38] text-xl font-normal font-['Mulish'] break-words">
          {test.TestName}
        </div>
      </div>

      {/* Dates and Button */}
      <div className="self-stretch flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex-col justify-start items-start gap-2 inline-flex">
          {/* Created Date */}
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3V7M8 3V7M4 11H20M7 14H7.013M10.01 14H10.015M13.01 14H13.015M16.015 14H16.02M13.015 17H13.02M7.01 17H7.015M10.01 17H10.015M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z" stroke="#827FAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-wrap">
              <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                {t('Tests.TestTeacherComponents.TestItem.issued')}
              </span>
              <span className="text-[#827ead] text-[15px] font-normal font-['Nunito']"> </span>
              <span className="text-[#120c38] text-[15px] font-extrabold font-['Mulish'] ml-1">
                {formatDate(test.CreatedDate)}
              </span>
            </div>
          </div>
          {/* Deadline Date */}
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="flex-shrink-0 ml-[2px]">
            <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 12L10 10V5M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604C15.5282 2.80031 14.5361 2.13738 13.4442 1.68508C12.3522 1.23279 11.1819 1 10 1C8.8181 1 7.64778 1.23279 6.55585 1.68508C5.46392 2.13738 4.47177 2.80031 3.63604 3.63604C2.80031 4.47177 2.13738 5.46392 1.68508 6.55585C1.23279 7.64778 1 8.8181 1 10Z"
                    stroke="#827FAE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
            </div>
            <div className="flex flex-wrap">
              <span className="text-[#827ead] text-[15px] font-bold font-['Nunito']">
                {t('Tests.TestTeacherComponents.TestItem.completeBy')}
              </span>
              <span className="text-[#827ead] text-[15px] font-normal font-['Nunito']"> </span>
              <span className="text-[#8a48e6] text-[15px] font-extrabold font-['Mulish'] ml-1">
                {formatDate(test.DeadlineDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={handleViewTestInfo}
            className="w-full sm:w-auto bg-[#8A48E6] hover:bg-purple-700 text-white font-[Nunito] text-[16px] sm:text-[18px] text-center rounded-[40px] cursor-pointer p-2 px-4 min-w-[120px]"
          >
            <span>
              {t('Tests.TestTeacherComponents.TestItem.results')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestItem;