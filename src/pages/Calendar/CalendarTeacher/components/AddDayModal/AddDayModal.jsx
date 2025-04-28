import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./AddDayModal.css";
import moment from "moment";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import { toast } from "react-toastify";

const AddDayModal = ({ isOpen, onClose, token, teacherId, onRefresh }) => {
  const { t } = useTranslation();
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
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEventType("one-time");
    setFormat("online");
    setSubject("");
    setSelectedGroupId(null);
    setStartHour("");
    setStartMinute("0");
    setEndHour("");
    setEndMinute("0");
    setDate("");
    setLinkOrAddress("");
    setErrors({});
    setTouched({});
  };

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen, teacherId, token]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/api/groups/groups-by-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data);
    } catch (error) {
      toast.error(t("CalendarTeacher.components.AddDayModal.Messages.FetchGroupsError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
      toast.error(t("CalendarTeacher.components.AddDayModal.Messages.GroupsLoadError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
      setErrors((prev) => ({
        ...prev,
        server: t("CalendarTeacher.components.AddDayModal.Messages.GroupsLoadError"),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupSelect = (groupName) => {
    const selectedGroup = groups.find((group) => group.GroupName === groupName);
    const groupId = selectedGroup?.GroupId || null;
    setSelectedGroupId(groupId);
    setTouched((prev) => ({ ...prev, group: true }));
    setErrors((prev) => ({
      ...prev,
      group: groupId ? "" : t("CalendarTeacher.components.AddDayModal.Messages.SelectGroupError"),
    }));
  };

  const validateSubject = (value) => {
    return !value.trim() ? t("CalendarTeacher.components.AddDayModal.Messages.SubjectEmptyError") : "";
  };

  const validateDate = (value) => {
    if (!value) return t("CalendarTeacher.components.AddDayModal.Messages.DateEmptyError");
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? t("CalendarTeacher.components.AddDayModal.Messages.DatePastError") : "";
  };

  const validateTime = (sHour, sMinute, eHour, eMinute) => {
    if (!sHour || sHour === "" || isNaN(parseInt(sHour)) || parseInt(sHour) < 0 || parseInt(sHour) > 23) {
      return t("CalendarTeacher.components.AddDayModal.Messages.StartHourError");
    }
    if (isNaN(parseInt(sMinute)) || parseInt(sMinute) < 0 || parseInt(sMinute) > 59) {
      return t("CalendarTeacher.components.AddDayModal.Messages.StartMinuteError");
    }
    if (!eHour || eHour === "" || isNaN(parseInt(eHour)) || parseInt(eHour) < 0 || parseInt(eHour) > 23) {
      return t("CalendarTeacher.components.AddDayModal.Messages.EndHourError");
    }
    if (isNaN(parseInt(eMinute)) || parseInt(eMinute) < 0 || parseInt(eMinute) > 59) {
      return t("CalendarTeacher.components.AddDayModal.Messages.EndMinuteError");
    }
    const startTime = parseInt(sHour) * 60 + parseInt(sMinute);
    const endTime = parseInt(eHour) * 60 + parseInt(eMinute);
    return startTime >= endTime ? t("CalendarTeacher.components.AddDayModal.Messages.TimeOrderError") : "";
  };

  const validateLinkOrAddress = (value, format) => {
    if (format === "online") {
      if (!value) return t("CalendarTeacher.components.AddDayModal.Messages.LinkEmptyError");
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value) ? "" : t("CalendarTeacher.components.AddDayModal.Messages.LinkInvalidError");
    } else if (format === "offline") {
      return !value ? t("CalendarTeacher.components.AddDayModal.Messages.AddressEmptyError") : "";
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
      group: selectedGroupId ? "" : t("CalendarTeacher.components.AddDayModal.Messages.SelectGroupError"),
      linkOrAddress: validateLinkOrAddress(linkOrAddress, format),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("CalendarTeacher.components.AddDayModal.Messages.FormValidationError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }
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
          StartLessonTime: moment(lessonDate.start).format("YYYY-MM-DDTHH:mm:ss"),
          EndLessonTime: moment(lessonDate.end).format("YYYY-MM-DDTHH:mm:ss"),
          LessonDate: moment(lessonDate.start).format("YYYY-MM-DD"),
          LessonType: format,
          GroupId: selectedGroupId,
          TeacherId: teacherId,
        };

        if (format === "offline" && linkOrAddress) lessonData.LessonAddress = linkOrAddress;
        if (format === "online" && linkOrAddress) lessonData.LessonLink = linkOrAddress;

        await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/plannedLessons`,
          lessonData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      const groupName = groups.find((group) => group.GroupId === selectedGroupId)?.GroupName;

      toast.success(t("CalendarTeacher.components.AddDayModal.Messages.SaveEventSuccess"));
      onClose();
      resetForm();
      onRefresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("CalendarTeacher.components.AddDayModal.Messages.SaveEventError");
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
      });
      setErrors((prev) => ({
        ...prev,
        server: t("CalendarTeacher.components.AddDayModal.Messages.SaveEventError"),
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="AddDayModal" onClick={onClose}>
      <div className="event-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="event-form-header">
          <h2 className="event-form-title">{t("CalendarTeacher.components.AddDayModal.UI.Title")}</h2>
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
          <label className="label">{t("CalendarTeacher.components.AddDayModal.UI.SubjectLabel")}</label>
          <input
            type="text"
            placeholder={t("CalendarTeacher.components.AddDayModal.UI.SubjectPlaceholder")}
            className={`input-field ${errors.subject && touched.subject ? "error-border" : ""}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => handleBlur("subject", subject)}
          />
          {touched.subject && errors.subject && <span className="error-text">{errors.subject}</span>}

          <label className="label">{t("CalendarTeacher.components.AddDayModal.UI.DateLabel")}</label>
          <input
            type="date"
            className={`input-field ${errors.date && touched.date ? "error-border" : ""}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur("date", date)}
          />
          {touched.date && errors.date && <span className="error-text">{errors.date}</span>}

          <label className="label">{t("CalendarTeacher.components.AddDayModal.UI.TimeLabel")}</label>
          <div className="time-block">
            <div className="time-input-wrapper">
              <div className="time-input-group">
                <span className="time-label">{t("CalendarTeacher.components.AddDayModal.UI.From")}</span>
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
                <span className="time-label">{t("CalendarTeacher.components.AddDayModal.UI.To")}</span>
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

          <label className="label">{t("CalendarTeacher.components.AddDayModal.UI.GroupLabel")}</label>
          <div className="dropdown-wrapper">
            {isLoading ? (
              <p>{t("CalendarTeacher.components.AddDayModal.UI.LoadingGroups")}</p>
            ) : (
              <Dropdown
                textAll={t("CalendarTeacher.components.AddDayModal.UI.SelectGroup")}
                options={groups.map((group) => ({ SubjectName: group.GroupName }))}
                onSelectSubject={handleGroupSelect}
              />
            )}
          </div>
          {touched.group && errors.group && <span className="error-text">{errors.group}</span>}

          <label className="label">{t("CalendarTeacher.components.AddDayModal.UI.FormatLabel")}</label>
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
              <span className="radio-text">{t("CalendarTeacher.components.AddDayModal.UI.Offline")}</span>
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
              <span className="radio-text">{t("CalendarTeacher.components.AddDayModal.UI.Online")}</span>
            </label>
          </div>

          <textarea
            placeholder={
              format === "online"
                ? t("CalendarTeacher.components.AddDayModal.UI.MeetingLinkPlaceholder")
                : t("CalendarTeacher.components.AddDayModal.UI.AddressPlaceholder")
            }
            className={`textarea-field ${errors.linkOrAddress && touched.linkOrAddress ? "error-border" : ""}`}
            rows={3}
            value={linkOrAddress}
            onChange={(e) => setLinkOrAddress(e.target.value)}
            onBlur={() => handleBlur("linkOrAddress", linkOrAddress)}
          />
          {touched.linkOrAddress && errors.linkOrAddress && (
            <span className="error-text">{errors.linkOrAddress}</span>
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
                <span className="radio-text">{t("CalendarTeacher.components.AddDayModal.UI.OneTime")}</span>
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
                <span className="radio-text">{t("CalendarTeacher.components.AddDayModal.UI.Weekly")}</span>
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
                <span className="radio-text">{t("CalendarTeacher.components.AddDayModal.UI.Biweekly")}</span>
              </label>
            </div>
          </div>

          {errors.server && <span className="error-text">{errors.server}</span>}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          {t("CalendarTeacher.components.AddDayModal.UI.AddToSchedule")}
        </button>
      </div>
    </div>
  );
};

export default AddDayModal;