import "./CreateModal.css";
import Dropdown from "../../../../components/Dropdown/Dropdown";

const CreateModal = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("CreateModal")) {
      onClose();
    }
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
          <Dropdown options={[{ SubjectName: "Математика" }, { SubjectName: "Фізика" }]} />
        </div>
        <button className="manual-test-button">
          <span>Створити тест самостійно</span>
        </button>
        <button className="ai-test-button">
          <span>Тест від штучного інтелекту</span>
        </button>
      </div>
    </div>
  );
};

export default CreateModal;