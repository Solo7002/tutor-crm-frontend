import React from 'react';

const NotificationItem = ({ type, studentName, course, group, date, text, onAccept, onDecline, onDelete, isMobile, role }) => {
    // Join notification (request to join a course)
    if (type === 'join') {
        return isMobile ? (
            <div className="bg-[#F5F5F5] rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[#120C38] text-base font-bold font-['Nunito']">
                            {studentName}
                        </p>
                        <p className="text-[#827EAD] text-sm font-normal font-['Mulish']">
                            Хоче приєднатися до курсу: {course}, група: {group}
                        </p>
                        <p className="text-[#827EAD] text-xs font-normal font-['Mulish']">
                            {date}
                        </p>
                    </div>
                    {role === 'Teacher' && (
                        <div className="flex space-x-2">
                            <button onClick={onAccept} className="w-8 h-8 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="#8A4AE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button onClick={onDecline} className="w-8 h-8 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="bg-[#F5F5F5] rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[#120C38] text-sm font-bold font-['Nunito']">
                            {studentName}
                        </p>
                        <p className="text-[#827EAD] text-xs font-normal font-['Mulish']">
                            Хоче приєднатися до курсу: {course}, група: {group}
                        </p>
                        <p className="text-[#827EAD] text-xs font-normal font-['Mulish']">
                            {date}
                        </p>
                    </div>
                    {role === 'Teacher' && (
                        <div className="flex space-x-2">
                            <button onClick={onAccept} className="w-8 h-8 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="#8A4AE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button onClick={onDecline} className="w-8 h-8 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Text notification (e.g., acceptance or rejection message)
    return isMobile ? (
        <div className="bg-[#F5F5F5] rounded-lg p-3 mb-2">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[#120C38] text-base font-normal font-['Mulish']">
                        {text}
                    </p>
                    <p className="text-[#827EAD] text-xs font-normal font-['Mulish']">
                        {date}
                    </p>
                </div>
                <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    ) : (
        <div className="bg-[#F5F5F5] rounded-lg p-3 mb-2">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[#120C38] text-sm font-normal font-['Mulish']">
                        {text}
                    </p>
                    <p className="text-[#827EAD] text-xs font-normal font-['Mulish']">
                        {date}
                    </p>
                </div>
                <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NotificationItem;