import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css";

const MyCalendar = ({ events, onDateSelect }) => {
  const localizer = momentLocalizer(moment);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const formattedEvents = events.map((event) => {
    const startDate = moment(`${event.LessonDate}T${event.StartLessonTime}`).toDate();
    const endDate = moment(`${event.LessonDate}T${event.EndLessonTime}`).toDate();
    return {
      title: event.LessonHeader || "Без назви",
      start: startDate,
      end: endDate,
      PlannedLessonId: event.PlannedLessonId,
      date: event.LessonDate,
    };
  });

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate());
  };

  const dayPropGetter = (date) => {
    const hasEvent = formattedEvents.some((event) =>
      moment(date).isSame(moment(event.date), "day")
    );
    const isSame = selectedDate
      ? moment(date).isSame(moment(selectedDate), "day")
      : false;

    console.log("selectedDate: ", selectedDate);

    let classname = "rbc-day-bg ";
    if (hasEvent) classname += "rbc-event ";
    if (isSame) classname += "rbc-selected-day ";
    return {
      className: classname,
    };
  };

  const handleSelectSlot = ({ start }) => {
    const iso = moment(start).format("YYYY-MM-DD");
    setSelectedDate(iso);
    onDateSelect(iso);
  };

  return (
    <div className="container">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month", "week", "day"]}
        style={{ height: 550 }}
        events={formattedEvents}
        dayPropGetter={dayPropGetter}
        date={currentDate}
        onNavigate={setCurrentDate}
        selectable={true} 
        onSelectSlot={handleSelectSlot} 
      />
      <div className="calendar-navigation">
        <button className="nav-button" onClick={handlePrevMonth}>
          {"< "}{moment(currentDate).subtract(1, "month").format("MMMM YYYY")}
        </button>
        <button className="nav-button" onClick={handleNextMonth}>
          {moment(currentDate).add(1, "month").format("MMMM YYYY")}{" >"}
        </button>
      </div>
    </div>
  );
};

export default MyCalendar;