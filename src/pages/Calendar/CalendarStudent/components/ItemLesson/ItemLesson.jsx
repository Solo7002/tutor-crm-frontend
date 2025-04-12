import { useState } from "react";
import axios from "axios";
import "./ItemLesson.css";

const ItemLesson = ({ lesson }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };



  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(end).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startTime}-${endTime}`;
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="item-lesson-container">
          
      <div className="item-lesson-header">
        <div className="item-lesson-circle" />
        <div>
          <div className="item-lesson-title">{lesson.LessonHeader || "Без назви"}</div>
          <div className="item-lesson-subtitle">
            {formatDate(lesson.LessonDate)} {formatTimeRange(lesson.StartLessonTime, lesson.EndLessonTime)}
          </div>
        </div>
        <div className="item-lesson-icon" onClick={toggleCollapse}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={
                isCollapsed
                  ? "M8.75 18.5375C8.98421 18.7703 9.30102 18.901 9.63125 18.901C9.96149 18.901 10.2783 18.7703 10.5125 18.5375L15 14.1125L19.425 18.5375C19.6592 18.7703 19.976 18.901 20.3063 18.901C20.6365 18.901 20.9533 18.7703 21.1875 18.5375C21.3047 18.4213 21.3977 18.283 21.4611 18.1307C21.5246 17.9784 21.5573 17.815 21.5573 17.65C21.5573 17.485 21.5246 17.3216 21.4611 17.1693C21.3977 17.017 21.3047 16.8787 21.1875 16.7625L15.8875 11.4625C15.7713 11.3453 15.633 11.2523 15.4807 11.1889C15.3284 11.1254 15.165 11.0928 15 11.0928C14.835 11.0928 14.6716 11.1254 14.5193 11.1889C14.367 11.2523 14.2287 11.3453 14.1125 11.4625L8.75 16.7625C8.63284 16.8787 8.53985 17.017 8.47639 17.1693C8.41293 17.3216 8.38025 17.485 8.38025 17.65C8.38025 17.815 8.41293 17.9784 8.47639 18.1307C8.53985 18.283 8.63284 18.4213 8.75 18.5375Z"
                  : "M13.2496 0.4631C13.0154 0.230286 12.6986 0.0996094 12.3684 0.0996094C12.0381 0.0996094 11.7213 0.230286 11.4871 0.4631L6.99963 4.8881L2.57463 0.4631C2.34043 0.230286 2.02361 0.0996094 1.69338 0.0996094C1.36315 0.0996094 1.04633 0.230286 0.812131 0.4631C0.69497 0.579304 0.601977 0.717555 0.538516 0.869879C0.475055 1.0222 0.442383 1.18559 0.442383 1.3506C0.442383 1.51561 0.475055 1.679 0.538516 1.83132C0.601977 1.98365 0.69497 2.1219 0.812131 2.2381L6.11213 7.5381C6.22833 7.65526 6.36659 7.74825 6.51891 7.81171C6.67123 7.87517 6.83462 7.90785 6.99963 7.90785C7.16465 7.90785 7.32803 7.87517 7.48035 7.81171C7.63268 7.74825 7.77093 7.65526 7.88713 7.5381L13.2496 2.2381C13.3668 2.1219 13.4598 1.98365 13.5232 1.83132C13.5867 1.679 13.6194 1.51561 13.6194 1.3506C13.6194 1.18559 13.5867 1.0222 13.5232 0.869879C13.4598 0.717555 13.3668 0.579304 13.2496 0.4631Z"
              }
              fill="#8A48E6"
            />
          </svg>
        </div>
      </div>

     
      <div className={`item-lesson-collapsible ${isCollapsed ? "collapsed" : "expanded"}`}>
        <div className="item-lesson-content">
          <div className="item-lesson-info">
            <span>Вчитель:</span>
            <span className="item-lesson-info-value">{`${lesson.TeacherFirstName} ${lesson.TeacherLastName}`}</span>
          </div>
          <div className="item-lesson-info mt-2">
            <span>Місце:</span>
            <span className="item-lesson-info-link">
              {lesson.LessonType === "online" ? (
                lesson.LessonLink ? (
                  <a href={lesson.LessonLink} target="_blank" rel="noopener noreferrer">
                    Посилання
                  </a>
                ) : (
                  "Немає посилання"
                )
              ) : (
                lesson.LessonAddress || "Немає адреси"
              )}
            </span>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ItemLesson;