import { useState, useEffect } from "react";
import axios from "axios";
import "./AddDayModal.css";
import moment from "moment";
import Dropdown from "../../../../../components/Dropdown/Dropdown";

const AddDayModal = ({ isOpen, onClose, token, teacherId }) => {
  const [eventType, setEventType] = useState("one-time");
  const [format, setFormat] = useState("online");
  const [subject, setSubject] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("0");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("0");
  const [date, setDate] = useState("");
  const [linkOrAddress, setLinkOrAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  teacherId = 1;

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen, teacherId, token]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/groups/groups-by-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setErrors((prev) => ({
        ...prev,
        server: "Не вдалося завантажити список груп",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupSelect = (groupName) => {
    const selectedGroup = groups.find(group => group.GroupName === groupName);
    setSelectedGroupId(selectedGroup?.GroupId || null);
  };

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!subject.trim()) newErrors.subject = "Предмет не може бути порожнім";
    if (!selectedGroupId) newErrors.group = "Виберіть групу";

    if (!startHour || startHour === "" || isNaN(parseInt(startHour)) || parseInt(startHour) < 0 || parseInt(startHour) > 23) {
      newErrors.time = "Введіть коректний час початку (0-23)";
    } else if (isNaN(parseInt(startMinute)) || parseInt(startMinute) < 0 || parseInt(startMinute) > 59) {
      newErrors.time = "Введіть коректні хвилини початку (0-59)";
    } else if (!endHour || endHour === "" || isNaN(parseInt(endHour)) || parseInt(endHour) < 0 || parseInt(endHour) > 23) {
      newErrors.time = "Введіть коректний час закінчення (0-23)";
    } else if (isNaN(parseInt(endMinute)) || parseInt(endMinute) < 0 || parseInt(endMinute) > 59) {
      newErrors.time = "Введіть коректні хвилини закінчення (0-59)";
    } else {
      const startTime = parseInt(startHour) * 60 + parseInt(startMinute);
      const endTime = parseInt(endHour) * 60 + parseInt(endMinute);
      if (startTime >= endTime) {
        newErrors.time = "Час закінчення має бути пізніше часу початку";
      }
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!date) newErrors.date = "Дата не може бути порожньою";
    else if (selectedDate < today) newErrors.date = "Дата не може бути раніше сьогоднішньої";

    if (format === "online") {
      if (!linkOrAddress) newErrors.link = "Посилання не може бути порожнім";
      else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(linkOrAddress)) newErrors.link = "Введіть коректне посилання";
    } else if (format === "offline" && !linkOrAddress) {
      newErrors.address = "Адреса не може бути порожньою";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:00`;
        const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:00`;

        const baseDate = new Date(date).toISOString().split("T")[0];
        const startMoment = moment(`${baseDate}T${startTime}`);
        const endMoment = moment(`${baseDate}T${endTime}`);

        const lessonDates = [];
        const endOfMonth = moment(baseDate).endOf("month").startOf("day");
        let currentDate = startMoment.clone();

        if (eventType === "one-time") {
          lessonDates.push({ start: startMoment.toDate(), end: endMoment.toDate() });
        } else if (eventType === "weekly") {
          while (currentDate.isSameOrBefore(endOfMonth)) {
            lessonDates.push({ start: currentDate.toDate(), end: currentDate.clone().add(endMoment.diff(startMoment)).toDate() });
            currentDate.add(7, "days");
          }
        } else if (eventType === "biweekly") {
          while (currentDate.isSameOrBefore(endOfMonth)) {
            lessonDates.push({ start: currentDate.toDate(), end: currentDate.clone().add(endMoment.diff(startMoment)).toDate() });
            currentDate.add(14, "days");
          }
        }

        for (const lessonDate of lessonDates) {
          const lessonData = {
            LessonHeader: subject,
            StartLessonTime: lessonDate.start.toISOString(),
            EndLessonTime: lessonDate.end.toISOString(),
            LessonDate: lessonDate.start.toISOString().split("T")[0],
            LessonType: format,
            GroupId: selectedGroupId,
            TeacherId: teacherId,
          };

          if (format === "offline" && linkOrAddress) lessonData.LessonAddress = linkOrAddress;
          if (format === "online" && linkOrAddress) lessonData.LessonLink = linkOrAddress;

          console.log("Sending lessonData:", lessonData);

          const response = await axios.post(
            "http://localhost:4000/api/plannedLessons",
            lessonData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Lesson created successfully:", response.data);
        }
        onClose();
        window.location.reload(); 
      } catch (error) {
        console.error("Error creating lesson:", error.response?.data || error.message);
        setErrors((prev) => ({
          ...prev,
          server: "Не вдалося зберегти подію. Спробуйте ще раз.",
        }));
      }
    }
  };

  return (
    <div className="AddDayModal" onClick={onClose}>
      <div className="event-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h2 className="event-form-title">Додати подію</h2>
          <button className="close-button" onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 1.33989C16.5083 2.21075 17.7629 3.46042 18.6398 4.96519C19.5167 6.46997 19.9854 8.17766 19.9994 9.91923C20.0135 11.6608 19.5725 13.3758 18.72 14.8946C17.8676 16.4133 16.6332 17.6831 15.1392 18.5782C13.6452 19.4733 11.9434 19.9627 10.2021 19.998C8.46083 20.0332 6.74055 19.6131 5.21155 18.7791C3.68256 17.9452 2.39787 16.7264 1.48467 15.2434C0.571462 13.7604 0.0614093 12.0646 0.00500011 10.3239L0 9.99989L0.00500011 9.67589C0.0610032 7.94888 0.563548 6.26585 1.46364 4.79089C2.36373 3.31592 3.63065 2.09934 5.14089 1.25977C6.65113 0.420205 8.35315 -0.0137108 10.081 0.000330246C11.8089 0.0143713 13.5036 0.47589 15 1.33989ZM8.511 7.13989C8.30148 7.01517 8.05361 6.9713 7.81401 7.01652C7.57441 7.06175 7.35959 7.19296 7.20995 7.38547C7.06031 7.57799 6.98617 7.81854 7.00146 8.0619C7.01675 8.30525 7.12043 8.53463 7.293 8.70689L8.585 9.99989L7.293 11.2929L7.21 11.3869C7.05459 11.5879 6.98151 11.8405 7.0056 12.0934C7.02969 12.3463 7.14916 12.5806 7.33972 12.7486C7.53029 12.9167 7.77767 13.0059 8.03162 12.9981C8.28557 12.9904 8.52704 12.8862 8.707 12.7069L10 11.4149L11.293 12.7069L11.387 12.7899C11.588 12.9453 11.8406 13.0184 12.0935 12.9943C12.3464 12.9702 12.5807 12.8507 12.7488 12.6602C12.9168 12.4696 13.006 12.2222 12.9982 11.9683C12.9905 11.7143 12.8863 11.4728 12.707 11.2929L11.415 9.99989L12.707 8.70689L12.79 8.61289C12.9454 8.4119 13.0185 8.15929 12.9944 7.90637C12.9703 7.65344 12.8508 7.41917 12.6603 7.25114C12.4697 7.08311 12.2223 6.99391 11.9684 7.00166C11.7144 7.00942 11.473 7.11354 11.293 7.29289L10 8.58489L8.707 7.29289L8.613 7.20989L8.511 7.13989Z"
                fill="#827FAE"
              />
            </svg>
          </button>
        </div>

        <div className="form-content">
          <label className="label">Предмет:</label>
          <input
            type="text"
            placeholder="Предмет"
            className={`input-field ${errors.subject ? "error-border" : ""}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && <span className="error-text">{errors.subject}</span>}

          <label className="label">Дата:</label>
          <input
            type="date"
            className={`input-field ${errors.date ? "error-border" : ""}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}

          <label className="label">Початок та кінець заняття:</label>
          <div className="time-block">
            <div className="time-input-wrapper">
              <div className="time-input-group">
                <span className="time-label">З   </span>
                <input
                  type="number"
                  className={`time-input ${errors.time ? "error-border" : ""}`}
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  required
                  step={1}
                  min={0}
                  max={23}
                />
                <span className="time-separator">:</span>
                <input
                  type="number"
                  className={`time-input ${errors.time ? "error-border" : ""}`}
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  step={1}
                  min={0}
                  max={59}
                  placeholder="0"
                />
              </div>
              <div className="time-input-group">
                <span className="time-label">До</span>
                <input
                  type="number"
                  className={`time-input ${errors.time ? "error-border" : ""}`}
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  required
                  step={1}
                  min={0}
                  max={23}
                />
                <span className="time-separator">:</span>
                <input
                  type="number"
                  className={`time-input ${errors.time ? "error-border" : ""}`}
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  step={1}
                  min={0}
                  max={59}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          {errors.time && <span className="error-text">{errors.time}</span>}

          <label className="label">Група:</label>
          <div className="dropdown-wrapper">
            {isLoading ? (
              <p>Завантаження груп...</p>
            ) : (
              <Dropdown
                textAll="Виберіть групу"
                options={groups.map((group) => ({ SubjectName: group.GroupName }))}
                onSelectSubject={handleGroupSelect}
              />
            )}
          </div>
          {errors.group && <span className="error-text">{errors.group}</span>}

          <label className="label">Формат проведення заняття:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="offline"
                checked={format === "offline"}
                onChange={(e) => setFormat(e.target.value)}
                className="radio-input"
              />
              <span className="radio-text">Офлайн</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="online"
                checked={format === "online"}
                onChange={(e) => setFormat(e.target.value)}
                className="radio-input"
              />
              <span className="radio-text">Онлайн</span>
            </label>
          </div>

          <textarea
            placeholder={format === "online" ? "Посилання на зустріч" : "Адреса"}
            className={`textarea-field ${errors.link || errors.address ? "error-border" : ""}`}
            rows={3}
            value={linkOrAddress}
            onChange={(e) => setLinkOrAddress(e.target.value)}
          />
          {(errors.link || errors.address) && (
            <span className="error-text">{errors.link || errors.address}</span>
          )}

          <div className="radio-group">
            <div>
              <label className="radio-label">
                <input
                  type="radio"
                  value="one-time"
                  checked={eventType === "one-time"}
                  onChange={(e) => setEventType(e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">Разова подія</span>
              </label>
            </div>
            <div>
              <label className="radio-label">
                <input
                  type="radio"
                  value="weekly"
                  checked={eventType === "weekly"}
                  onChange={(e) => setEventType(e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">Повторювати кожен тиждень</span>
              </label>
            </div>
            <div>
              <label className="radio-label">
                <input
                  type="radio"
                  value="biweekly"
                  checked={eventType === "biweekly"}
                  onChange={(e) => setEventType(e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">Повторювати кожні 2 тижні</span>
              </label>
            </div>
          </div>

          {errors.server && <span className="error-text">{errors.server}</span>}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Додати до розкладу
        </button>
      </div>
    </div>
  );
};

export default AddDayModal;