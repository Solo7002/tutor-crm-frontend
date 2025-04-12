import React, { useState, useEffect } from "react";
import ItemLesson from "../ItemLesson/ItemLesson";
import AddDayModal from "../AddDayModal/AddDayModal";
import Dropdown from "../../../../Materials/components/Dropdown";
import "./PanelLessons.css";
import moment from "moment";

const PanelLessons = ({ token, teacherId, lessons: initialLessons, selectedDate, onResetDate }) => {
  const [lessons, setLessons] = useState(initialLessons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortType, setSortType] = useState("today"); 
  const [date, setDate] = useState(moment().format("DD.MM.YYYY"));

  useEffect(() => {
    sortLessons(selectedDate ? "selected" : sortType); 
  }, [initialLessons, sortType, selectedDate]);

  const onAddClose = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const addLesson = () => {
    onAddClose();
  };

  const sortLessons = (type) => {
    let sortedLessons = [...initialLessons];
    const today = moment().startOf("day");

    if (type === "selected" && selectedDate) {
    
      sortedLessons = sortedLessons.filter((lesson) =>
        moment(lesson.LessonDate).isSame(moment(selectedDate), "day")
      );
      setDate(moment(selectedDate).format("DD.MM.YYYY"));
      setSortType("selected"); 
    } else {
      switch (type) {
        case "date":
          sortedLessons.sort((a, b) => new Date(a.LessonDate) - new Date(b.LessonDate));
          setDate(moment().format("DD.MM.YYYY"));
          break;
        case "week":
          sortedLessons = sortedLessons.filter((lesson) => {
            const lessonDate = moment(lesson.LessonDate).startOf("day");
            const startOfWeek = today.clone().startOf("week");
            const endOfWeek = startOfWeek.clone().add(6, "days");
            return lessonDate.isBetween(startOfWeek, endOfWeek, null, "[]");
          });
          setDate(
            `${today.clone().startOf("week").format("DD.MM")} - ${today
              .clone()
              .endOf("week")
              .format("DD.MM YYYY")}`
          );
          break;
        case "month":
          sortedLessons = sortedLessons.filter((lesson) => {
            const lessonDate = moment(lesson.LessonDate).startOf("day");
            const startOfMonth = today.clone().startOf("month");
            const endOfMonth = today.clone().endOf("month");
            return lessonDate.isBetween(startOfMonth, endOfMonth, null, "[]");
          });
          setDate(today.format("MMMM YYYY"));
          break;
        case "today":
          sortedLessons = sortedLessons.filter((lesson) => {
            const lessonDate = moment(lesson.LessonDate).startOf("day");
            return lessonDate.isSame(today, "day");
          });
          setDate(today.format("DD.MM.YYYY"));
          break;
        default:
          break;
      }
      setSortType(type);
    }

    setLessons(sortedLessons);
  };

 
  const sortOptions = {
    "За сьогодні": ["today"],
    "За тиждень": ["week"],
    "За місяць": ["month"],
    ...(selectedDate && {
      [`За ${moment(selectedDate).format("DD.MM.YYYY")}`]: ["selected"],
    }), 
  };

  const handleSortSelect = (selectedLabel) => {
    const selectedType = sortOptions[selectedLabel][0];
    if (selectedType !== "selected" && onResetDate) {
      onResetDate(); 
    }
    sortLessons(selectedType);
  };

  return (
    <div className="panel">
      <AddDayModal token={token} teacherId={teacherId} onClose={onAddClose} isOpen={isAddModalOpen} />
      <div className="panel-header">
        <div className="panel-date-dropdown">
          <Dropdown onSelect={handleSortSelect} categories={sortOptions} />
        </div>
        <div className="panel-date">{date}</div>
      </div>

      <div className="panel-lessons">
        {lessons.map((lesson) => (
          <ItemLesson key={lesson.PlannedLessonId} lesson={lesson} token={token} />
        ))}
      </div>

      <button className="panel-add-button" onClick={addLesson}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="#8A48E6" />
          <path
            d="M12 7V17M7 12H17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default PanelLessons;