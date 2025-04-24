import React, { useState } from "react";
import { Calendar } from "react-calendar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Schedule.css";

const Schedule = ({ days = [] }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const isOutsideMonth = date.getMonth() !== selectedDate.getMonth();
      if (isOutsideMonth) {
        return "outside-month-tile";
      }
      const day = days.find((day) => {
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
    return t("HomeTeacher.Schedule.title", {
      month: t(`HomeTeacher.Schedule.months.${date.getMonth()}`),
      year: date.getFullYear(),
    });
  };

  const formatShortWeekday = (locale, date) => {
    const weekday = date.getDay();
    return t(`HomeTeacher.Schedule.weekdays.${weekday}`);
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded-[20px] mb-4 sm:mb-6 shadow-md h-[26vh] sm:h-[28vh] justify-center items-start gap-2 sm:gap-[22.67px] overflow-hidden">
      <h2
        className="text-base sm:text-lg md:text-xl font-semibold m-2 sm:m-3"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          lineHeight: "1.35",
          letterSpacing: "0.5pt",
          color: "#120C38",
        }}
      >
        {t("HomeTeacher.Schedule.title", {
          month: t(`HomeTeacher.Schedule.months.${selectedDate.getMonth()}`),
          year: selectedDate.getFullYear(),
        })}
      </h2>
      {days.length > 0 ? (
        <Calendar
          className="custom-calendar"
          value={selectedDate}
          onChange={() => navigate("/teacher/calendar")}
          tileClassName={getTileClassName}
          navigationLabel={({ date }) => formatMonthYear(null, date)}
          showNavigation={false}
          locale="en-US"
          formatShortWeekday={formatShortWeekday}
        />
      ) : (
        <div
          className="text-sm sm:text-base text-center mt-10"
          style={{
            fontFamily: "Mulish",
            letterSpacing: "-0.5%",
            color: "#120C38",
          }}
        >
          {t("HomeTeacher.Schedule.no_data")}
        </div>
      )}
    </div>
  );
};

export default Schedule;