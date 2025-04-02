import { useState, useEffect } from "react";
import "./CreateModal.css";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom"
const CreateModal = ({ onClose, teacher_id, token }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const groupsResponse = await axios.get(
          `http://localhost:4000/api/groups/groups-by-teacher/${teacher_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        setGroups(groupsResponse.data);
  
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [teacher_id, token]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("CreateModal")) {
      onClose();
    }
  };

  const handleGroupSelect = (groupName) => {
    const selectedGroup = groups.find(group => group.GroupName === groupName);
    setSelectedGroupId(selectedGroup?.GroupId || null);
  };
  const handleManualTestClick = () => {
    navigate(`create/${selectedGroupId}`);
    navigate(0); 
  };

  const handleAITestClick = () => {
    navigate(`create-ai/${selectedGroupId}`);
    navigate(0);
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
        <h2 className="modal-title">Створення тесту</h2>
        <div className="dropdown-wrapper">
          {isLoading ? (
            <p>Завантаження груп...</p>
          ) : (
            <Dropdown 
              textAll="Виберіть групу"
              options={groups.map(group => ({ SubjectName:  group.GroupName }))}
              onSelectSubject={handleGroupSelect}
            />
          )}
        </div>
        
    
        {selectedGroupId && (
          <div className="buttons-container">
            <button 
              className="manual-test-button"
              onClick={handleManualTestClick}
            >
              <span>Створити тест самостійно</span>
            </button>
            <button 
              className="ai-test-button"
              onClick={handleAITestClick}
            >
              <span>Тест від штучного інтелекту</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateModal;