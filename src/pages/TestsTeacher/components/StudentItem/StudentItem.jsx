import "./StudentItem.css";

const StudentItem = ({ name = "Ім'я студента", date = "01.03.2025", score = 6, maxScore = 12, status = "Active", img }) => {
  const scoreRatio = maxScore > 0 ? score / maxScore : 0;
  let styleStatus = status;
  
  if (status !== "Default") {
    if (scoreRatio < 0.33) {
      styleStatus = "Low";
    } else if (scoreRatio < 0.66) {
      styleStatus = "Medium";
    } else {
      styleStatus = "High";
    }
  }
  
  return (
    <div className="StudentItem">
      <div
        className="StudentItem-container"
        data-style-status={styleStatus}
      >
        {img && (
          <img
            className="StudentItem-avatar"
            src={img}
            alt="Student avatar"
          />
        )}
        
        <div className="StudentItem-info">
          <div className="StudentItem-name">{name}</div>
          {status !== "Default" && (
            <div className="StudentItem-date">{date}</div>
          )}
        </div>
        
        {status !== "Default" && (
          <div
            className="StudentItem-score"
            data-style-status={styleStatus}
            data-property-1={status}
          >
            <div className="StudentItem-score-text">
              {score}/{maxScore}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentItem;