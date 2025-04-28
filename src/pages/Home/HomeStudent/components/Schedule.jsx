import React, { useState } from "react";
import { Calendar } from "react-calendar";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import "./Schedule.css";

const Schedule = ({ days = [] }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  
  const months = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];
  
  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const isOutsideMonth = date.getMonth() !== selectedDate.getMonth();
      if (isOutsideMonth) {
        return "outside-month-tile";
      }
      const day = days && days.find((day) => {
        const dayDate = new Date(day.date);
        return (
          dayDate.getDate() === date.getDate() &&
          dayDate.getMonth() === date.getMonth() &&
          dayDate.getFullYear() === date.getFullYear()
        );
      });
      if (day) {
        return day.type === "Lesson"
          ? "lesson-tile"
          : day.type === "Homework"
            ? "homework-tile"
            : "";
      }
    }
    return "";
  };
  
  const formatMonthYear = (locale, date) => {
    const month = t(`HomeStudent.Schedule.months.${date.getMonth()}`);
    const year = date.getFullYear();
    return `${month} ${year}`;
  };
  
  const formatShortWeekday = (locale, date) => {
    const weekdays = [
      t('HomeStudent.Schedule.weekdays.sun'),
      t('HomeStudent.Schedule.weekdays.mon'),
      t('HomeStudent.Schedule.weekdays.tue'),
      t('HomeStudent.Schedule.weekdays.wed'),
      t('HomeStudent.Schedule.weekdays.thu'),
      t('HomeStudent.Schedule.weekdays.fri'),
      t('HomeStudent.Schedule.weekdays.sat'),
    ];
    return weekdays[date.getDay()].charAt(0);
  };
  
  return (
    <div className="bg-white p-2 sm:p-4 rounded-[20px] mb-4 sm:mb-6 shadow-md h-auto min-h-[28vh] flex flex-col schedule-mobile-hidden">
      {/* Header */}
      <h2
        className="text-base sm:text-lg font-semibold m-2 sm:m-3"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "0.59pt",
          color: "#120C38",
        }}
      >
        {t('HomeStudent.Schedule.title', {
          month: t(`HomeStudent.Schedule.months.${selectedDate.getMonth()}`),
          year: selectedDate.getFullYear(),
        })}
      </h2>
      
      {/* Calendar */}
      <div className="flex-grow flex items-center justify-center">
        <Calendar
          className="custom-calendar"
          value={selectedDate}
          onChange={() => navigate("/student/calendar")}
          tileClassName={getTileClassName}
          navigationLabel={({ date }) => formatMonthYear(null, date)}
          showNavigation={false}
          locale="en-US"
          formatShortWeekday={formatShortWeekday}
        />
      </div>
    </div>
  );
};

export default Schedule;