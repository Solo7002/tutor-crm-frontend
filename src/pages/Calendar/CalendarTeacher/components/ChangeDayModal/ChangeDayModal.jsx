import { useState, useEffect } from "react";
import axios from "axios";
import "./ChangeDayModal.css";
import moment from "moment";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import { toast } from "react-toastify";

const ChangeDayModal = ({ isOpen, onClose, token, initialData, teacherId }) => {
  const [format, setFormat] = useState(initialData?.LessonType || "online");
  const [subject, setSubject] = useState(initialData?.LessonHeader || "");
  const [selectedGroupId, setSelectedGroupId] = useState(initialData?.GroupId?.toString() || null);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const startMoment = initialData?.StartLessonTime ? moment(initialData.StartLessonTime) : null;
  const endMoment = initialData?.EndLessonTime ? moment(initialData.EndLessonTime) : null;

  const [startHour, setStartHour] = useState(startMoment ? moment.utc(startMoment).format("HH") : "");
  const [startMinute, setStartMinute] = useState(startMoment ? moment.utc(startMoment).format("mm") : "0");
  const [endHour, setEndHour] = useState(endMoment ? moment.utc(endMoment).format("HH") : "");
  const [endMinute, setEndMinute] = useState(endMoment ? moment.utc(endMoment).format("mm") : "0");

  const [date, setDate] = useState(
    initialData?.LessonDate ? moment(initialData.LessonDate).format("YYYY-MM-DD") : ""
  );
  const [linkOrAddress, setLinkOrAddress] = useState(
    initialData?.LessonType === "online" ? initialData?.LessonLink || "" : initialData?.LessonAddress || ""
  );

  useEffect(() => {
    if (groups.length > 0 && initialData?.GroupId) {
      const initialGroup = groups.find((group) => group.GroupId === initialData.GroupId);
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
      console.error("Error fetching groups:", error);
      toast.error("Не вдалося завантажити список груп");
      setErrors((prev) => ({
        ...prev,
        server: "Не вдалося завантажити список груп",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupSelect = (groupName) => {
    const selectedGroup = groups.find((group) => group.GroupName === groupName);
    const groupId = selectedGroup?.GroupId?.toString() || null;
    setSelectedGroupId(groupId);
    setTouched((prev) => ({ ...prev, group: true }));
    setErrors((prev) => ({
      ...prev,
      group: groupId ? "" : "Виберіть групу",
    }));
  };

  const validateSubject = (value) => {
    return !value.trim() ? "Предмет не може бути порожнім" : "";
  };

  const validateDate = (value) => {
    if (!value) return "Дата не може бути порожньою";
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? "Дата не може бути раніше сьогоднішньої" : "";
  };

  const validateTime = (sHour, sMinute, eHour, eMinute) => {
    if (!sHour || sHour === "" || isNaN(parseInt(sHour)) || parseInt(sHour) < 0 || parseInt(sHour) > 23) {
      return "Введіть коректний час початку (0-23)";
    }
    if (isNaN(parseInt(sMinute)) || parseInt(sMinute) < 0 || parseInt(sMinute) > 59) {
      return "Введіть коректні хвилини початку (0-59)";
    }
    if (!eHour || eHour === "" || isNaN(parseInt(eHour)) || parseInt(eHour) < 0 || parseInt(eHour) > 23) {
      return "Введіть коректний час закінчення (0-23)";
    }
    if (isNaN(parseInt(eMinute)) || parseInt(eMinute) < 0 || parseInt(eMinute) > 59) {
      return "Введіть коректні хвилини закінчення (0-59)";
    }
    const startTime = parseInt(sHour) * 60 + parseInt(sMinute);
    const endTime = parseInt(eHour) * 60 + parseInt(eMinute);
    return startTime >= endTime ? "Час закінчення має бути пізніше часу початку" : "";
  };

  const validateLinkOrAddress = (value, format) => {
    if (format === "online") {
      if (!value) return "Посилання не може бути порожнім";
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value) ? "" : "Введіть коректне посилання";
    } else if (format === "offline") {
      return !value ? "Адреса не може бути порожньою" : "";
    }
    return "";
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error = "";
    switch (field) {
      case "subject":
        error = validateSubject(value);
        break;
      case "date":
        error = validateDate(value);
        break;
      case "time":
        error = validateTime(startHour, startMinute, endHour, endMinute);
        break;
      case "linkOrAddress":
        error = validateLinkOrAddress(value, format);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      subject: validateSubject(subject),
      date: validateDate(date),
      time: validateTime(startHour, startMinute, endHour, endMinute),
      group: selectedGroupId ? "" : "Виберіть групу",
      linkOrAddress: validateLinkOrAddress(linkOrAddress, format),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Будь ласка, виправте помилки у формі");
      return;
    }

    try {
      const id = initialData.PlannedLessonId;
      const lessonDate = moment(date).format("YYYY-MM-DD");
      const startTime = `${String(parseInt(startHour)).padStart(2, "0")}:${String(parseInt(startMinute)).padStart(2, "0")}:00`;
      const endTime = `${String(parseInt(endHour)).padStart(2, "0")}:${String(parseInt(endMinute)).padStart(2, "0")}:00`;

      const lessonData = {
        LessonHeader: subject,
        StartLessonTime: `${lessonDate}T${startTime}`,
        EndLessonTime: `${lessonDate}T${endTime}`,
        LessonType: format,
        LessonDate: lessonDate,
        GroupId: parseInt(selectedGroupId),
        LessonAddress: format === "offline" ? linkOrAddress : null,
        LessonLink: format === "online" ? linkOrAddress : null,
      };

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

      const groupName = groups.find(group => group.GroupId.toString() === selectedGroupId)?.GroupName;
      toast.success(
        <div>
          <p>Заняття успішно оновлено!</p>
          <p>Предмет: {subject}</p>
          <p>Група: {groupName}</p>
          <p>Дата: {moment(lessonDate).format("DD.MM.YYYY")}</p>
          <p>Час: {startTime} - {endTime}</p>
          <p>Формат: {format === "online" ? "Онлайн" : "Офлайн"}</p>
        </div>,
        { autoClose: 5000 }
      );

      onClose();
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Не вдалося оновити подію. Спробуйте ще раз.";
      toast.error(errorMessage);
      setErrors((prev) => ({
        ...prev,
        server: errorMessage,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ChangeDayModal" onClick={onClose}>
      <div className="event-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h2 className="event-form-title">Редагувати подію</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#120C38"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="form-content">
          <label className="label">Предмет:</label>
          <input
            type="text"
            placeholder="Предмет"
            className={`input-field ${errors.subject && touched.subject ? "error-border" : ""}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => handleBlur("subject", subject)}
          />
          {touched.subject && errors.subject && <span className="error-text">{errors.subject}</span>}

          <label className="label">Дата:</label>
          <input
            type="date"
            className={`input-field ${errors.date && touched.date ? "error-border" : ""}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur("date", date)}
          />
          {touched.date && errors.date && <span className="error-text">{errors.date}</span>}

          <label className="label">Початок та кінець заняття:</label>
          <div className="time-block">
            <div className="time-input-wrapper">
              <div className="time-input-group">
                <span className="time-label">З   </span>
                <input
                  type="number"
                  className={`time-input ${errors.time && touched.time ? "error-border" : ""}`}
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  onBlur={() => handleBlur("time", startHour)}
                  step={1}
                  min={0}
                  max={23}
                />
                <span className="time-separator">:</span>
                <input
                  type="number"
                  className={`time-input ${errors.time && touched.time ? "error-border" : ""}`}
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  onBlur={() => handleBlur("time", startMinute)}
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
                  className={`time-input ${errors.time && touched.time ? "error-border" : ""}`}
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  onBlur={() => handleBlur("time", endHour)}
                  step={1}
                  min={0}
                  max={23}
                />
                <span className="time-separator">:</span>
                <input
                  type="number"
                  className={`time-input ${errors.time && touched.time ? "error-border" : ""}`}
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  onBlur={() => handleBlur("time", endMinute)}
                  step={1}
                  min={0}
                  max={59}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          {touched.time && errors.time && <span className="error-text">{errors.time}</span>}

          <label className="label">Група:</label>
          <div className="dropdown-wrapper">
            {isLoading ? (
              <p>Завантаження груп...</p>
            ) : (
              <Dropdown
                textAll="Виберіть групу"
                options={groups.map((group) => ({ SubjectName: group.GroupName }))}
                onSelectSubject={handleGroupSelect}
                selectedSubject={groups.find((group) => group.GroupId.toString() === selectedGroupId)?.GroupName || "Виберіть групу"}
              />
            )}
          </div>
          {touched.group && errors.group && <span className="error-text">{errors.group}</span>}

          <label className="label">Формат проведення заняття:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="offline"
                checked={format === "offline"}
                onChange={(e) => {
                  setFormat(e.target.value);
                  handleBlur("linkOrAddress", linkOrAddress);
                }}
                className="radio-input"
              />
              <span className="radio-text">Офлайн</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="online"
                checked={format === "online"}
                onChange={(e) => {
                  setFormat(e.target.value);
                  handleBlur("linkOrAddress", linkOrAddress);
                }}
                className="radio-input"
              />
              <span className="radio-text">Онлайн</span>
            </label>
          </div>

          <textarea
            placeholder={format === "online" ? "Посилання на зустріч" : "Адреса"}
            className={`textarea-field ${errors.linkOrAddress && touched.linkOrAddress ? "error-border" : ""}`}
            rows={3}
            value={linkOrAddress}
            onChange={(e) => setLinkOrAddress(e.target.value)}
            onBlur={() => handleBlur("linkOrAddress", linkOrAddress)}
          />
          {touched.linkOrAddress && errors.linkOrAddress && (
            <span className="error-text">{errors.linkOrAddress}</span>
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