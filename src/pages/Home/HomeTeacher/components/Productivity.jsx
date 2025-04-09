import React, { useState } from "react";

const Productivity = ({ productivityData }) => {
  const [period, setPeriod] = useState("За весь час");

  const periodMapping = {
    "За весь час": "AllTime",
    "За рік": "Year",
    "За пів року": "HalfYear",
    "За 3 місяці": "ThreeMonth",
    "За місяць": "Month",
    "За тиждень": "Week",
    "За день": "Day",
  };

  const periods = Object.keys(periodMapping);

  const safeProductivityData = productivityData || {};
  
  const currentPeriodData = safeProductivityData[periodMapping[period]] || 
                          safeProductivityData["AllTime"] || 
                          {
                            tasksChecked: 0,
                            prevTasksChecked: 0,
                            lessonsConducted: 0,
                            prevLessonsConducted: 0,
                            newClients: 0,
                            prevNewClients: 0,
                            reviewsReceived: 0,
                            prevReviewsReceived: 0,
                            rating: 0,
                          };

  const fullStars = Math.floor(currentPeriodData.rating || 0);
  const fractionalPart = (currentPeriodData.rating || 0) - fullStars;

  const getChangeIndicator = (current, previous) => {
    if (current === previous) {
      return <span className="text-[#120C38] text-lg font-bold">—</span>;
    }
    return (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            current > previous
              ? "M12 9.5L12 9M12 9L6 15M12 9L18 15"
              : "M12 14.5V15M12 15L18 9M12 15L6 9"
          }
          stroke={current > previous ? "#43B56A" : "#E64851"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const getChangeText = (current, previous) => {
    if (current === previous) {
      return <span className="text-[#120C38]">(-)</span>;
    }
    const diff = Math.round(current - previous);
    return (
      <span className={diff > 0 ? "text-[#43B56A]" : "text-[#E64851]"}>
        ({diff > 0 ? "+" : ""}{diff})
      </span>
    );
  };

  const tasksIndicator = getChangeIndicator(
    currentPeriodData.tasksChecked,
    currentPeriodData.prevTasksChecked
  );
  const lessonsIndicator = getChangeIndicator(
    currentPeriodData.lessonsConducted,
    currentPeriodData.prevLessonsConducted
  );
  const clientsChange = getChangeText(
    currentPeriodData.newClients,
    currentPeriodData.prevNewClients
  );
  const reviewsChange = getChangeText(
    currentPeriodData.reviewsReceived,
    currentPeriodData.prevReviewsReceived
  );

  return (
    <div className="flex-1 bg-white p-4 rounded-[20px] shadow-md h-full">
      <div className="relative w-full h-[277px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#120c38] font-bold font-['Nunito'] text-xl md:text-2xl">
            Продуктивність
          </h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-10 px-2 bg-white rounded-2xl border border-[#d7d7d7] text-[#827ead] text-lg font-bold font-['Nunito'] focus:outline-none"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Рейтинг */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#120c38] text-lg font-bold font-['Mulish']">
            Рейтинг
          </span>
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= fullStars;
                const partialFill = star === fullStars + 1 && fractionalPart > 0;
                const fillWidth = partialFill ? `${fractionalPart * 100}%` : "0%";

                return (
                  <div key={star} className="relative w-6 h-6">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                        fill="none"
                        stroke="#8A48E6"
                        strokeWidth="1"
                      />
                      {(isFilled || partialFill) && (
                        <path
                          d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                          fill="#8A48E6"
                          style={partialFill ? { clipPath: `inset(0 ${100 - fractionalPart * 100}% 0 0)` } : {}}
                        />
                      )}
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Перевірено завдань */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#120c38] text-lg font-normal font-['Mulish']">
            Перевірено завдань
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#120c38] text-lg font-semibold font-['Mulish']">
              {currentPeriodData.tasksChecked || 0}
            </span>
            {tasksIndicator}
          </div>
        </div>

        {/* Проведено уроків */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#120c38] text-lg font-normal font-['Mulish']">
            Проведено уроків
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#120c38] text-lg font-semibold font-['Mulish']">
              {currentPeriodData.lessonsConducted || 0}
            </span>
            {lessonsIndicator}
          </div>
        </div>

        {/* Нові учні */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#120c38] text-lg font-normal font-['Mulish']">
            Нові учні
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[#120c38] text-lg font-semibold font-['Mulish']">
              {currentPeriodData.newClients || 0}
            </span>
            <sup className="text-[10px] font-semibold font-['Mulish']">
              {clientsChange}
            </sup>
          </div>
        </div>

        {/* Отримані відгуки */}
        <div className="flex justify-between items-center">
          <span className="text-[#120c38] text-lg font-normal font-['Mulish']">
            Отримані відгуки
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[#120c38] text-lg font-semibold font-['Mulish']">
              {currentPeriodData.reviewsReceived || 0}
            </span>
            <sup className="text-[10px] font-semibold font-['Mulish']">
              {reviewsChange}
            </sup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;