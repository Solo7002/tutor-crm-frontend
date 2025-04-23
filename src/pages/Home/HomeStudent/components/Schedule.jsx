import React, { useState } from "react";
import { Calendar } from "react-calendar";
import { useNavigate } from 'react-router-dom';
import "./Schedule.css";

const Schedule = ({ days }) => {
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
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const formatShortWeekday = (locale, date) => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[date.getDay()].charAt(0);
  };

  return (
    <div className="bg-white p-4 rounded-[20px] mb-6 shadow-md h-[28vh] justify-center items-start gap-[22.67px] overflow-hidden schedule-mobile-hidden">
      {/* Header */}
      <h2
        className="text-lg font-semibold m-3"
        style={{
          fontFamily: "Nunito",
          fontWeight: "700",
          fontSize: "16pt",
          lineHeight: "10.2pt",
          letterSpacing: "0.59pt",
          color: "#120C38",
        }}
      >
        {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </h2>

      {/* Calendar */}
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
  );
};

export default Schedule;