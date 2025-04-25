import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AddReviewModal = ({ isOpened, onClose, userIdFor, userIdFrom, onRefreshReviews }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(isOpened);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    setIsOpen(isOpened);
  }, [isOpened]);

  if (!isOpen) return null;

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const currentDate = new Date().toISOString();
      const reviewData = {
        ReviewHeader: reviewText,
        ReviewText: reviewText,
        CreateDate: currentDate,
        Stars: rating,
        UserIdFrom: userIdFrom,
        UserIdFor: userIdFor,
      };

      await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/userReviews`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }, reviewData);
      onClose();
      onRefreshReviews();
      toast.success(t('ProfileTeacher.AddReviewModal.Messages.ReviewSent'));
    } catch (error) {
      toast.error(t('ProfileTeacher.AddReviewModal.Messages.ReviewError'));
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none">
        <div className="w-full max-w-md relative pointer-events-auto">
          <div className="w-full bg-white rounded-2xl p-6">
            <div className="text-center text-[#8a48e6] text-2xl font-bold font-['Nunito'] mb-3">
              {t('ProfileTeacher.AddReviewModal.Title')}
            </div>

            <div
              className="flex justify-center mb-6"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating > 0 ? hoverRating : rating);
                return (
                  <div
                    key={star}
                    className="w-6 h-6 mx-1 overflow-hidden cursor-pointer"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.9998 18.4873L5.82784 21.7323L7.00684 14.8593L2.00684 9.99226L8.90684 8.99226L11.9928 2.73926L15.0788 8.99226L21.9788 9.99226L16.9788 14.8593L18.1578 21.7323L11.9998 18.4873Z"
                        fill={isFilled ? '#FFA869' : 'none'}
                        stroke="#FFA869"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>

            <div className="w-full mb-6">
              <textarea
                className="w-full p-4 min-h-[120px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#dfdfdf] text-[#827ead] text-[15px] font-normal font-['Mulish'] resize-none"
                placeholder={t('ProfileTeacher.AddReviewModal.Placeholder')}
                value={reviewText}
                onChange={handleTextChange}
              />
            </div>

            <button
              className="w-full py-3 px-4 bg-[#8a4ae6] hover:bg-purple-700 rounded-2xl text-center text-white text-xl font-medium font-['Nunito']"
              onClick={handleSubmit}
            >
              {t('ProfileTeacher.AddReviewModal.Button.Submit')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReviewModal;