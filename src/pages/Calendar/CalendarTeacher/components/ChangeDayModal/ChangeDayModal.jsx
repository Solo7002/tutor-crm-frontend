import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./ChangeDayModal.css";
import moment from "moment";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import { toast } from "react-toastify";

const ChangeDayModal = ({ isOpen, onClose, token, initialData, teacherId, onRefresh }) => {
  const { t } = useTranslation();
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
        `${process.env.REACT_APP_BASE_API_URL}/api/groups/groups-by-teacher/${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(response.data);
    } catch (error) {
      toast.error(t("CalendarTeacher.components.ChangeDayModal.Messages.FetchGroupsError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
      toast.error(t("CalendarTeacher.components.ChangeDayModal.Messages.GroupsLoadError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
      setErrors((prev) => ({
        ...prev,
        server: t("CalendarTeacher.components.ChangeDayModal.Messages.GroupsLoadError"),
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
      group: groupId ? "" : t("CalendarTeacher.components.ChangeDayModal.Messages.SelectGroupError"),
    }));
  };

  const validateSubject = (value) => {
    return !value.trim() ? t("CalendarTeacher.components.ChangeDayModal.Messages.SubjectEmptyError") : "";
  };

  const validateDate = (value) => {
    if (!value) return t("CalendarTeacher.components.ChangeDayModal.Messages.DateEmptyError");
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? t("CalendarTeacher.components.ChangeDayModal.Messages.DatePastError") : "";
  };

  const validateTime = (sHour, sMinute, eHour, eMinute) => {
    if (!sHour || sHour === "" || isNaN(parseInt(sHour)) || parseInt(sHour) < 0 || parseInt(sHour) > 23) {
      return t("CalendarTeacher.components.ChangeDayModal.Messages.StartHourError");
    }
    if (isNaN(parseInt(sMinute)) || parseInt(sMinute) < 0 || parseInt(sMinute) > 59) {
      return t("CalendarTeacher.components.ChangeDayModal.Messages.StartMinuteError");
    }
    if (!eHour || eHour === "" || isNaN(parseInt(eHour)) || parseInt(eHour) < 0 || parseInt(eHour) > 23) {
      return t("CalendarTeacher.components.ChangeDayModal.Messages.EndHourError");
    }
    if (isNaN(parseInt(eMinute)) || parseInt(eMinute) < 0 || parseInt(eMinute) > 59) {
      return t("CalendarTeacher.components.ChangeDayModal.Messages.EndMinuteError");
    }
    const startTime = parseInt(sHour) * 60 + parseInt(sMinute);
    const endTime = parseInt(eHour) * 60 + parseInt(eMinute);
    return startTime >= endTime ? t("CalendarTeacher.components.ChangeDayModal.Messages.TimeOrderError") : "";
  };

  const validateLinkOrAddress = (value, format) => {
    if (format === "online") {
      if (!value) return t("CalendarTeacher.components.ChangeDayModal.Messages.LinkEmptyError");
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value)
        ? ""
        : t("CalendarTeacher.components.ChangeDayModal.Messages.LinkInvalidError");
    } else if (format === "offline") {
      return !value ? t("CalendarTeacher.components.ChangeDayModal.Messages.AddressEmptyError") : "";
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
      group: selectedGroupId ? "" : t("CalendarTeacher.components.ChangeDayModal.Messages.SelectGroupError"),
      linkOrAddress: validateLinkOrAddress(linkOrAddress, format),
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("CalendarTeacher.components.ChangeDayModal.Messages.FormValidationError"), {
        position: "bottom-right",
        autoClose: 5000,
      });
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
        `${process.env.REACT_APP_BASE_API_URL}/api/plannedLessons/${id}`,
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const groupName = groups.find((group) => group.GroupId.toString() === selectedGroupId)?.GroupName;
      toast.success(
        <div>
          <p>{t("CalendarTeacher.components.ChangeDayModal.Messages.UpdateEventSuccess")}</p>
          <p>{t("CalendarTeacher.components.ChangeDayModal.UI.SubjectLabel")} {subject}</p>
          <p>{t("CalendarTeacher.components.ChangeDayModal.UI.GroupLabel")} {groupName}</p>
          <p>
            {t("CalendarTeacher.components.ChangeDayModal.UI.DatesLabel")}{" "}
            {moment(lessonDate).format("DD.MM.YYYY")}
          </p>
          <p>
            {t("CalendarTeacher.components.ChangeDayModal.UI.TimeRangeLabel")} {startTime} - {endTime}
          </p>
          <p>
            {t("CalendarTeacher.components.ChangeDayModal.UI.FormatLabelSuccess")}{" "}
            {format === "online"
              ? t("CalendarTeacher.components.ChangeDayModal.UI.Online")
              : t("CalendarTeacher.components.ChangeDayModal.UI.Offline")}
          </p>
        </div>,
        { autoClose: 5000 }
      );

      onClose();
      onRefresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("CalendarTeacher.components.ChangeDayModal.Messages.UpdateEventError");
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
      });
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
          <h2 className="event-form-title">{t("CalendarTeacher.components.ChangeDayModal.UI.Title")}</h2>
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
          <label className="label">{t("CalendarTeacher.components.ChangeDayModal.UI.SubjectLabel")}</label>
          <input
            type="text"
            placeholder={t("CalendarTeacher.components.ChangeDayModal.UI.SubjectPlaceholder")}
            className={`input-field ${errors.subject && touched.subject ? "error-border" : ""}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => handleBlur("subject", subject)}
          />
          {touched.subject && errors.subject && <span className="error-text">{errors.subject}</span>}

          <label className="label">{t("CalendarTeacher.components.ChangeDayModal.UI.DateLabel")}</label>
          <input
            type="date"
            className={`input-field ${errors.date && touched.date ? "error-border" : ""}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur("date", date)}
          />
          {touched.date && errors.date && <span className="error-text">{errors.date}</span>}

          <label className="label">{t("CalendarTeacher.components.ChangeDayModal.UI.TimeLabel")}</label>
          <div className="time-block">
            <div className="time-input-wrapper">
              <div className="time-input-group">
                <span className="time-label">{t("CalendarTeacher.components.ChangeDayModal.UI.From")}</span>
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
                <span className="time-label">{t("CalendarTeacher.components.ChangeDayModal.UI.To")}</span>
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

          <label className="label">{t("CalendarTeacher.components.ChangeDayModal.UI.GroupLabel")}</label>
          <div className="dropdown-wrapper">
            {isLoading ? (
              <p>{t("CalendarTeacher.components.ChangeDayModal.UI.LoadingGroups")}</p>
            ) : (
              <Dropdown
                textAll={t("CalendarTeacher.components.ChangeDayModal.UI.SelectGroup")}
                options={groups.map((group) => ({ SubjectName: group.GroupName }))}
                onSelectSubject={handleGroupSelect}
                selectedSubject={
                  groups.find((group) => group.GroupId.toString() === selectedGroupId)?.GroupName ||
                  t("CalendarTeacher.components.ChangeDayModal.UI.SelectGroup")
                }
              />
            )}
          </div>
          {touched.group && errors.group && <span className="error-text">{errors.group}</span>}

          <label className="label">{t("CalendarTeacher.components.ChangeDayModal.UI.FormatLabel")}</label>
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
              <span className="radio-text">{t("CalendarTeacher.components.ChangeDayModal.UI.Offline")}</span>
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
              <span className="radio-text">{t("CalendarTeacher.components.ChangeDayModal.UI.Online")}</span>
            </label>
          </div>

          <textarea
            placeholder={
              format === "online"
                ? t("CalendarTeacher.components.ChangeDayModal.UI.MeetingLinkPlaceholder")
                : t("CalendarTeacher.components.ChangeDayModal.UI.AddressPlaceholder")
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

          {errors.server && <span className="error-text">{errors.server}</span>}
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          {t("CalendarTeacher.components.ChangeDayModal.UI.SaveChanges")}
        </button>
      </div>
    </div>
  );
};

export default ChangeDayModal;