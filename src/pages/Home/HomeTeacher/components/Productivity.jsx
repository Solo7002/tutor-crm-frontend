import React, { useState } from "react";

const Productivity = ({ productivityData }) => {
  const [period, setPeriod] = useState("За місяць");

  const periods = [
    "За весь час",
    "За рік",
    "За пів року",
    "За 3 місяці",
    "За місяць",
    "За тиждень",
    "За день",
  ];

  const filterDataByPeriod = (data, selectedPeriod) => {
    const filtered = { ...data };
    switch (selectedPeriod) {
      case "За день":
        filtered.tasksChecked = Math.round(data.tasksChecked * (1 / 30));
        filtered.lessonsConducted = Math.round(data.lessonsConducted * (1 / 30));
        filtered.newClients = Math.round(data.newClients * (1 / 30));
        filtered.reviewsReceived = Math.round(data.reviewsReceived * (1 / 30));
        break;
      case "За тиждень":
        filtered.tasksChecked = Math.round(data.tasksChecked * (7 / 30));
        filtered.lessonsConducted = Math.round(data.lessonsConducted * (7 / 30));
        filtered.newClients = Math.round(data.newClients * (7 / 30));
        filtered.reviewsReceived = Math.round(data.reviewsReceived * (7 / 30));
        break;
      case "За місяць":
        break;
      case "За 3 місяці":
        filtered.tasksChecked = Math.round(data.tasksChecked * 3);
        filtered.lessonsConducted = Math.round(data.lessonsConducted * 3);
        filtered.newClients = Math.round(data.newClients * 3);
        filtered.reviewsReceived = Math.round(data.reviewsReceived * 3);
        break;
      case "За пів року":
        filtered.tasksChecked = Math.round(data.tasksChecked * 6);
        filtered.lessonsConducted = Math.round(data.lessonsConducted * 6);
        filtered.newClients = Math.round(data.newClients * 6);
        filtered.reviewsReceived = Math.round(data.reviewsReceived * 6);
        break;
      case "За рік":
        filtered.tasksChecked = Math.round(data.tasksChecked * 12);
        filtered.lessonsConducted = Math.round(data.lessonsConducted * 12);
        filtered.newClients = Math.round(data.newClients * 12);
        filtered.reviewsReceived = Math.round(data.reviewsReceived * 12);
        break;
      case "За весь час":
        filtered.tasksChecked = Math.round(data.tasksChecked * 36);
        filtered.lessonsConducted = Math.round(data.lessonsConducted * 36);
        filtered.newClients = Math.round(data.newClients * 36);
        filtered.reviewsReceived = Math.round(data.reviewsReceived * 36);
        break;
      default:
        break;
    }
    return filtered;
  };

  const filteredData = filterDataByPeriod(productivityData, period);
  const fullStars = Math.floor(filteredData.rating);
  const fractionalPart = filteredData.rating - fullStars;

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

  const tasksIndicator = getChangeIndicator(filteredData.tasksChecked, filteredData.prevTasksChecked);
  const lessonsIndicator = getChangeIndicator(filteredData.lessonsConducted, filteredData.prevLessonsConducted);
  const clientsChange = getChangeText(filteredData.newClients, filteredData.prevNewClients);
  const reviewsChange = getChangeText(filteredData.reviewsReceived, filteredData.prevReviewsReceived);

  return (
    <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-full">
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
            {periods.map((p, index) => (
              <option key={index} value={p}>
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
                let fillPercentage = 0;
                if (star <= fullStars) {
                  fillPercentage = 100; // Полностью заполненная звезда
                } else if (star === fullStars + 1 && fractionalPart > 0) {
                  fillPercentage = fractionalPart * 100; // Частично заполненная звезда
                }

                return (
                  <svg
                    key={star}
                    className="w-6 h-6"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <clipPath id={`clip-${star}`}>
                        <rect x="0" y="0" width={`${fillPercentage}%`} height="16" />
                      </clipPath>
                    </defs>
                    <path
                      d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                      fill="none"
                      stroke="#8A48E6"
                    />
                    <g clipPath={`url(#clip-${star})`}>
                      <path
                        d="M5.56692 5.38811L5.82715 5.35038L5.94353 5.11459L7.84553 1.26126L7.84568 1.26096C7.85943 1.23305 7.88072 1.20955 7.90715 1.19311C7.93357 1.17668 7.96406 1.16797 7.99518 1.16797C8.02629 1.16797 8.05679 1.17668 8.08321 1.19311C8.10963 1.20955 8.13092 1.23305 8.14468 1.26096L8.14479 1.26119L10.0461 5.11453L10.1625 5.35033L10.4227 5.3881L14.676 6.00543L14.6762 6.00545C14.7053 6.00968 14.7329 6.02155 14.7559 6.03987C14.779 6.05819 14.7968 6.0823 14.8075 6.10974C14.8182 6.13718 14.8215 6.16698 14.817 6.19609C14.8129 6.22186 14.8029 6.24629 14.7878 6.26743L14.759 6.29881L11.6865 9.28896L11.4979 9.4725L11.5424 9.73188L12.2697 13.9685L12.2698 13.9687C12.2748 13.9979 12.2719 14.0278 12.2616 14.0555C12.2512 14.0832 12.2336 14.1076 12.2107 14.1263C12.1877 14.1449 12.1603 14.1572 12.131 14.1617C12.1049 14.1657 12.0782 14.1635 12.0532 14.1552L12.0157 14.138L8.23227 12.1443L7.99944 12.0216L7.7665 12.1441L3.9625 14.1441L3.9623 14.1442C3.93616 14.1579 3.90684 14.1645 3.87733 14.1632C3.84782 14.1619 3.81918 14.1527 3.79436 14.1367C3.76953 14.1207 3.74941 14.0984 3.73605 14.0721C3.72416 14.0486 3.718 14.0228 3.71801 13.9966L3.72286 13.9556L4.44731 9.73181L4.49179 9.4725L4.30326 9.28899L1.22193 6.28966L1.22147 6.28921C1.2003 6.26866 1.18497 6.24287 1.17704 6.21446C1.16911 6.18604 1.16885 6.15604 1.17631 6.1275C1.18377 6.09896 1.19867 6.07291 1.21948 6.05201C1.23799 6.03343 1.26059 6.01951 1.28542 6.01133L1.32765 6.00274L5.56692 5.38811Z"
                        fill="#8A48E6"
                      />
                    </g>
                  </svg>
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
              {filteredData.tasksChecked || 0}
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
              {filteredData.lessonsConducted || 0}
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
              {filteredData.newClients || 0}
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
              {filteredData.reviewsReceived || 0}
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