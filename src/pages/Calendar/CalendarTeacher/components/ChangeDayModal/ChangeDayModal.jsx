import { useState, useEffect } from "react";
import axios from "axios";
import "./ChangeDayModal.css";
import moment from "moment";
import Dropdown from "../../../../../components/Dropdown/Dropdown";

const ChangeDayModal = ({ isOpen, onClose, token, initialData, teacherId }) => {
  const [format, setFormat] = useState(initialData?.LessonType || "online");
  const [subject, setSubject] = useState(initialData?.LessonHeader || "");
  const [selectedGroupId, setSelectedGroupId] = useState(initialData?.GroupId?.toString() || null);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const startMoment = initialData?.StartLessonTime ? moment(initialData.StartLessonTime) : null;
  const endMoment = initialData?.EndLessonTime ? moment(initialData.EndLessonTime) : null;

  const [startHour, setStartHour] = useState(startMoment ? startMoment.format("HH") : "");
  const [startMinute, setStartMinute] = useState(startMoment ? startMoment.format("mm") : "0");
  const [endHour, setEndHour] = useState(endMoment ? endMoment.format("HH") : "");
  const [endMinute, setEndMinute] = useState(endMoment ? endMoment.format("mm") : "0");

  const [date, setDate] = useState(
    initialData?.LessonDate ? moment(initialData.LessonDate).format("YYYY-MM-DD") : ""
  );
  const [linkOrAddress, setLinkOrAddress] = useState(
    initialData?.LessonType === "online" ? initialData?.LessonLink || "" : initialData?.LessonAddress || ""
  );
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (groups.length > 0 && initialData?.GroupId) {
      const initialGroup = groups.find(group => group.GroupId === initialData.GroupId);
      if (initialGroup) {
        setSelectedGroupId(initialGroup.GroupId.toString());
      }
    }
  }, [groups, initialData]);
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
    setSelectedGroupId(selectedGroup?.GroupId?.toString() || null);
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
        const id = initialData.PlannedLessonId;
        const lessonDate = moment(date).format("YYYY-MM-DD");
        const startTime = `${lessonDate} ${String(parseInt(startHour)).padStart(2, "0")}:${String(parseInt(startMinute)).padStart(2, "0")}:00`;
        const endTime = `${lessonDate} ${String(parseInt(endHour)).padStart(2, "0")}:${String(parseInt(endMinute)).padStart(2, "0")}:00`;
        
        const lessonData = {
          LessonHeader: subject,
          StartLessonTime: startTime,
          EndLessonTime: endTime,
          LessonType: format,
          LessonDate: lessonDate,
          GroupId: parseInt(selectedGroupId),
          LessonAddress: format === "offline" ? linkOrAddress : null,
          LessonLink: format === "online" ? linkOrAddress : null,
        };
        console.log(lessonData);
        
        await axios.put(
          `http://localhost:4000/api/plannedLessons/${id}`,
          lessonData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        onClose();
        window.location.reload(); 
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          server: "Не вдалося оновити подію. Спробуйте ще раз.",
        }));
      }
    }
  };
  

  return (
    <div className="ChangeDayModal" onClick={onClose}>
      <div className="event-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h2 className="event-form-title">Редагувати подію</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 3.34C18.5083 4.21085 19.7629 5.46053 20.6398 6.9653C21.5167 8.47007 21.9854 10.1778 21.9994 11.9193C22.0135 13.6609 21.5725 15.376 20.72 16.8947C19.8676 18.4134 18.6332 19.6832 17.1392 20.5783C15.6452 21.4734 13.9434 21.9628 12.2021 21.9981C10.4608 22.0333 8.74055 21.6132 7.21155 20.7792C5.68256 19.9453 4.39787 18.7265 3.48467 17.2435C2.57146 15.7605 2.06141 14.0647 2.005 12.324L2 12L2.005 11.676C2.061 9.94899 2.56355 8.26596 3.46364 6.79099C4.36373 5.31602 5.63065 4.09945 7.14089 3.25988C8.65113 2.42031 10.3531 1.9864 12.081 2.00044C13.8089 2.01448 15.5036 2.476 17 3.34ZM10.511 9.14C10.3015 9.01528 10.0536 8.9714 9.81401 9.01663C9.57441 9.06186 9.35959 9.19306 9.20995 9.38558C9.06031 9.5781 8.98617 9.81865 9.00146 10.062C9.01675 10.3054 9.12043 10.5347 9.293 10.707L10.585 12L9.293 13.293L9.21 13.387C9.05459 13.588 8.98151 13.8406 9.0056 14.0935C9.02969 14.3464 9.14916 14.5807 9.33972 14.7488C9.53029 14.9168 9.77767 15.006 10.0316 14.9982C10.2856 14.9905 10.527 14.8863 10.707 14.707L12 13.415L13.293 14.707L13.387 14.79C13.588 14.9454 13.8406 15.0185 14.0935 14.9944C14.3464 14.9703 14.5807 14.8508 14.7488 14.6603C14.9168 14.4697 15.006 14.2223 14.9982 13.9684C14.9905 13.7144 14.8863 13.473 14.707 13.293L13.415 12L14.707 10.707L14.79 10.613C14.9454 10.412 15.0185 10.1594 14.9944 9.90647C14.9703 9.65355 14.8508 9.41928 14.6603 9.25125C14.4697 9.08321 14.2223 8.99402 13.9684 9.00177C13.7144 9.00953 13.473 9.11365 13.293 9.293L12 10.585L10.707 9.293L10.613 9.21L10.511 9.14Z"
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
                selectedSubject={groups.find(group => group.GroupId.toString() === selectedGroupId)?.GroupName || "Виберіть групу"}
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

          {errors.server && <span className="error-text">{errors.server}</span>}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Зберегти зміни
        </button>
      </div>
    </div>
  );
};

export default ChangeDayModal;