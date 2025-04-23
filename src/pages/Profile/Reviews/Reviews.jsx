import React, { useState, useEffect } from "react";
import axios from "axios";
import Comment from '../components/Comment';
import AddReviewModal from "../components/AddReviewModal";
import { toast } from 'react-toastify';

const Reviews = ({ userId, userFrom = null }) => {
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [canMakeReview, setCanMakeReview] = useState(false);
  const [isAddModalOpened, setIsAddModalOpened] = useState(false);
  const [userFromId, setUserFromId] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    if (userId){
      try {
        axios.get(`http://localhost:4000/api/userReviews/getInfoByUserId/${userId}`)
        .then((res) => {
          if (!res.data) return;
          setReviews(res.data.reverse());
        });
      } catch (error) {
        toast.error("Помилка при отриманні відгуків!");
      }
    }
  }, [userId, refreshReviews]);

  useEffect(() => {
    if (userFrom && userId){
      try {
        axios.get(`http://localhost:4000/api/userReviews/canUserMakeRiview/${userId}/${userFrom.UserId}`)
        .then((res) => {
          setCanMakeReview(res.data);
          setUserFromId(userFrom.UserId);
        });
      } catch (error) {
        toast.error("Помилка при отриманні відгуків!");
      }
    }
  }, [userFrom, userId, canMakeReview]);

  const handleLoadMore = () => {
    setVisibleReviews((prevVisible) => prevVisible + 2);
  };

  return (
    <div className="w-full bg-white rounded-[20px] flex flex-col p-4 sm:p-5 md:p-[20px] mb-8">
      <AddReviewModal 
      isOpened={isAddModalOpened}
      onClose={() => setIsAddModalOpened(false)}
      userIdFor={userId}
      userIdFrom={userFromId}
      onRefreshReviews={() => {setRefreshReviews(!refreshReviews)}}
      />

      <div className="text-center text-[#120c38] text-xl sm:text-2xl font-bold font-['Nunito'] mb-4 sm:mb-6">
        {reviews.length > 0? "Відгуки учнів" : "Відгуки відсутні"}
      </div>
      <div className="comments w-full grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.slice(0, visibleReviews).map((review) => (
          <Comment key={review.UserReviewId} review={review} />
        ))}
      </div>
      {visibleReviews < reviews.length && (

        <div className="text-left ml-4 mt-4 sm:mt-[20px]">
          <button
            className=" text-[#8a48e6] text-sm sm:text-[15px] font-bold font-['Nunito'] cursor-pointer hover:underline"
            onClick={handleLoadMore}
          >
            {` Читати більше коментарів >`}
          </button>
        </div>
      )}

      {
        (userFrom && canMakeReview) &&
        (<div className="w-full">
          <button
            className="w-full max-w-[418px] h-10 sm:h-12 mt-3 mb-2 mx-auto sm:my-5 bg-[#8a4ae6] hover:bg-purple-700 rounded-xl sm:rounded-2xl text-white text-base sm:text-xl font-medium font-['Nunito'] flex items-center justify-center"
            onClick={() => {setIsAddModalOpened(true)}}
          >
            Додати коментар
          </button>
        </div>)
      }
    </div>
  );
};

export default Reviews;