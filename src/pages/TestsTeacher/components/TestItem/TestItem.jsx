import "./TestItem.css";
import { PrimaryButton } from "../../../../components/Buttons/Buttons";
import {formatDate} from '../../../../functions/formatDate';
import { useNavigate } from "react-router-dom";

const TestItem = ({ test, token }) => {
    const navigate = useNavigate();
    const handleViewTestInfo = () => {
       console.log(navigate(`results/${test.TestId}`));
    }

    return (
        <div className="TestItem">
            <div data-property-1="Valid" data-size="Small" className="relative rounded-3xl pb-4 test-pattern-bg test-item-card">
                <div className="test-item-content">
                    <div className="test-item-description" title={test.TestName}>
                        {test.TestName}
                    </div>
                    <div className="test-item-footer">
                        <div className="test-item-dates">
                            <div className="test-item-date-wrapper">
                                <div>
                                    <svg
                                        width="18"
                                        height="20"
                                        viewBox="0 0 18 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13 1V5M5 1V5M1 9H17M4 12H4.013M7.01 12H7.015M10.01 12H10.015M13.015 12H13.02M10.015 15H10.02M4.01 15H4.015M7.01 15H7.015M1 5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V5Z"
                                            stroke="#827FAE"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="test-item-date-text">
                                    <span className="test-item-date-label">Видано:</span>
                                    <span className="test-item-date-value">
                                        {formatDate(test.CreatedDate)}
                                    </span>
                                </div>
                            </div>
                            <div className="test-item-date-wrapper">
                                <div>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M13 12L10 10V5M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604C15.5282 2.80031 14.5361 2.13738 13.4442 1.68508C12.3522 1.23279 11.1819 1 10 1C8.8181 1 7.64778 1.23279 6.55585 1.68508C5.46392 2.13738 4.47177 2.80031 3.63604 3.63604C2.80031 4.47177 2.13738 5.46392 1.68508 6.55585C1.23279 7.64778 1 8.8181 1 10Z"
                                            stroke="#827FAE"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="test-item-date-text">
                                    <span className="test-item-date-label">Виконати до:</span>
                                    <span className="test-item-date-due">
                                        {formatDate(test.DeadlineDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="test-item-button-wrapper">
                            <PrimaryButton className="test-item-button" onClick={handleViewTestInfo}>Результати</PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestItem;