import React, { useState } from "react";

const Comment = ({ review }) => {
    const [expanded, setExpanded] = useState(false);
    const maxLength = 100;
    const shouldTruncate = review.ReviewText.length > maxLength;

    const renderStars = (stars) => {
        const fullStar = (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M8.24325 7.33992L1.86325 8.26492L1.75025 8.28792C1.57919 8.33333 1.42325 8.42333 1.29835 8.54872C1.17344 8.67412 1.08406 8.83041 1.03932 9.00165C0.994575 9.17289 0.996081 9.35293 1.04368 9.5234C1.09128 9.69386 1.18327 9.84864 1.31025 9.97192L5.93225 14.4709L4.84225 20.8259L4.82925 20.9359C4.81878 21.1128 4.85552 21.2894 4.9357 21.4474C5.01589 21.6055 5.13664 21.7394 5.28559 21.8354C5.43454 21.9315 5.60634 21.9862 5.7834 21.994C5.96046 22.0018 6.13642 21.9625 6.29325 21.8799L11.9993 18.8799L17.6923 21.8799L17.7923 21.9259C17.9573 21.9909 18.1367 22.0109 18.312 21.9837C18.4873 21.9565 18.6522 21.8832 18.7898 21.7712C18.9275 21.6592 19.0328 21.5127 19.0951 21.3466C19.1574 21.1804 19.1743 21.0008 19.1443 20.8259L18.0533 14.4709L22.6773 9.97092L22.7553 9.88592C22.8667 9.74869 22.9397 9.58438 22.967 9.40972C22.9942 9.23506 22.9747 9.0563 22.9103 8.89165C22.846 8.72701 22.7392 8.58235 22.6007 8.47244C22.4623 8.36252 22.2972 8.29126 22.1223 8.26592L15.7423 7.33992L12.8903 1.55992C12.8077 1.39246 12.68 1.25144 12.5214 1.15283C12.3629 1.05422 12.1799 1.00195 11.9933 1.00195C11.8066 1.00195 11.6236 1.05422 11.4651 1.15283C11.3065 1.25144 11.1788 1.39246 11.0963 1.55992L8.24325 7.33992Z" fill="#FFA869" />
            </svg>
        );

        const emptyStar = (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M11.9998 17.75L5.82784 20.995L7.00684 14.122L2.00684 9.25495L8.90684 8.25495L11.9928 2.00195L15.0788 8.25495L21.9788 9.25495L16.9788 14.122L18.1578 20.995L11.9998 17.75Z" stroke="#FFA869" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );

        const starElements = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                starElements.push(<div key={i} className="mr-0.5 sm:mr-1">{fullStar}</div>);
            } else {
                starElements.push(<div key={i} className="mr-0.5 sm:mr-1">{emptyStar}</div>);
            }
        }
        return starElements;
    };

    return (
        <div className="w-full">
            <div className="w-full mx-2 sm:mx-3 md:mx-[20px] my-3 sm:my-4 md:my-[20px]">
                <div className="w-full flex items-start">
                    <img
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
                        src={review.UserFrom.ImageFilePath ? review.UserFrom.ImageFilePath : `https://ui-avatars.com/api/?name=${review.UserFrom.LastName + ' ' + review.UserFrom.FirstName}&background=random&size=86`}
                        alt="review image"
                    />

                    <div className="flex-grow flex flex-col sm:flex-row sm:justify-between ml-2 sm:ml-3 md:ml-4">
                        <div className="relative">
                            <div className="text-black text-sm sm:text-[15px] font-bold font-['Nunito']">
                                {review.UserFrom.FirstName} {review.UserFrom.LastName}
                            </div>
                            <div className="text-[#827ead] text-xs font-normal font-['Mulish'] mt-0.5 sm:mt-1">
                                Курс: {review.UserFrom.CourseName}
                            </div>
                        </div>
                        <div className="flex mt-1 mr-5 sm:mt-0">
                            {renderStars(review.Stars)}
                        </div>
                    </div>
                </div>
                <div className="relative mt-3 sm:mt-4 md:mt-[20px]">
                    <div className="text-[#827ead] text-sm sm:text-[15px] font-normal font-['Mulish'] w-full">
                        {expanded || !shouldTruncate ? review.ReviewText : review.ReviewText.slice(0, maxLength) + "..."}
                    </div>
                    {shouldTruncate && !expanded && (
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent"></div>
                    )}
                </div>
                {shouldTruncate && (
                    <button
                        className="text-[#8a48e6] text-xs sm:text-[13px] font-normal font-['Mulish'] mt-1 sm:mt-2"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Менше" : "Більше >"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comment;