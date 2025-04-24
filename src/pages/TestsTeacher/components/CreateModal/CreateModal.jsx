import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./CreateModal.css";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../../../utils/crypto";
import { toast } from "react-toastify";

const CreateModal = ({ onClose, teacher_id, token }) => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/courses/courses-by-teacher/${teacher_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error) {
        toast.error(t("Tests.TestTeacherComponents.CreateModal.errorMessage"));
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [teacher_id, token, t]);

  useEffect(() => {
    if (selectedCourseId) {
      const fetchGroups = async () => {
        setIsLoadingGroups(true);
        try {
          const response = await axios.get(
            `http://localhost:4000/api/groups/groups-by-course/${selectedCourseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setGroups(response.data);
        } catch (error) {
          toast.error(t("Tests.TestTeacherComponents.CreateModal.errorMessage"));
        } finally {
          setIsLoadingGroups(false);
        }
      };
      fetchGroups();
    } else {
      setGroups([]);
    }
  }, [selectedCourseId, token, t]);

  useEffect(() => {
    setSelectedGroupId(null);
  }, [selectedCourseId]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("CreateModal")) {
      onClose();
    }
  };

  const handleCourseSelect = (courseName) => {
    const selectedCourse = courses.find(
      (course) => course.CourseName === courseName
    );
    setSelectedCourseId(selectedCourse?.CourseId || null);
  };

  const handleGroupSelect = (groupName) => {
    const selectedGroup = groups.find(
      (group) => group.GroupName === groupName
    );
    setSelectedGroupId(selectedGroup?.GroupId || null);
  };

  const handleManualTestClick = () => {
    const encryptedGroupId = encryptData(selectedGroupId);
    navigate(`create/${encryptedGroupId}`);
  };

  const handleAITestClick = () => {
    const encryptedGroupId = encryptData(selectedGroupId);
    navigate(`create-ai/${encryptedGroupId}`);
  };

  return (
    <div className="CreateModal" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          <div className="close-icon">
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 7.5H15M1 7.5L7 13.5M1 7.5L7 1.5"
                stroke="#827FAE"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        <h2 className="modal-title">
          {t("Tests.TestTeacherComponents.CreateModal.modalTitle")}
        </h2>

        <div className="dropdowns-container">
          {isLoadingCourses ? (
            <p>
              {t(
                "Tests.TestTeacherComponents.CreateModal.loadingCourses"
              )}
            </p>
          ) : (
            <div className="dropdown-wrapper">
              <Dropdown
                textAll={t(
                  "Tests.TestTeacherComponents.CreateModal.selectCourse"
                )}
                options={courses.map((course) => ({
                  SubjectName: course.CourseName,
                }))}
                onSelectSubject={handleCourseSelect}
                wFull={true}
              />
            </div>
          )}

          {selectedCourseId &&
            (isLoadingGroups ? (
              <p>
                {t(
                  "Tests.TestTeacherComponents.CreateModal.loadingGroups"
                )}
              </p>
            ) : (
              <div className="dropdown-wrapper">
                <Dropdown
                  textAll={t(
                    "Tests.TestTeacherComponents.CreateModal.selectGroup"
                  )}
                  options={groups.map((group) => ({
                    SubjectName: group.GroupName,
                  }))}
                  onSelectSubject={handleGroupSelect}
                  wFull={true}
                />
              </div>
            ))}
        </div>

        {selectedGroupId && (
          <div className="buttons-container">
            <button
              className="manual-test-button"
              onClick={handleManualTestClick}
            >
              <span>
                {t(
                  "Tests.TestTeacherComponents.CreateModal.manualTestButton"
                )}
              </span>
            </button>
            <button
              className="ai-test-button"
              onClick={handleAITestClick}
            >
              <span>
                {t(
                  "Tests.TestTeacherComponents.CreateModal.aiTestButton"
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModal;