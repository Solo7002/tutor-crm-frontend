import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import NotificationItem from './NotificationItem';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const NotificationList = ({ onClose, userId, Role = null }) => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
      const { t } = useTranslation();

    // Fetch notifications based on role
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                let response;
                if (Role === 'Teacher') {
                    response = await axios.get(`http://localhost:4000/api/notifications/teacher/${userId}`);
                    const joinNotifications = response.data.notifications.map((notification) => ({
                        key: notification.key,
                        type: 'join',
                        studentName: notification.studentName,
                        course: notification.courseName,
                        group: notification.groupName,
                        date: new Date(notification.date).toLocaleDateString('uk-UA'),
                        studentId: notification.studentId,
                        groupId: notification.groupId,
                        teacherId: notification.teacherId,
                        timestamp: notification.key.split(':')[4],
                    }));
                    setNotifications(joinNotifications);
                } else if (Role === 'Student') {
                    response = await axios.get(`http://localhost:4000/api/notifications/student/${userId}`);
                    const textNotifications = response.data.notifications.map((notification) => ({
                        key: notification.key,
                        type: 'text',
                        text: notification.message,
                        date: new Date(notification.date).toLocaleDateString('uk-UA'),
                    }));
                    setNotifications(textNotifications);
                }
            } catch (err) {
                setError(t('Navbar.Errors.Notifications'));
            }
        };

        if (Role) {
            fetchNotifications();
        }
    }, [userId, Role]);

    // Handle accepting a join request (for teachers)
    const handleAccept = async (notification) => {
        if (Role !== 'Teacher') return;
        try {
            const { studentId, groupId, timestamp, teacherId } = notification;
            await axios.post(
                `http://localhost:4000/api/notifications/accept/${studentId}/${groupId}/${timestamp}`,
                { teacherId }
            );
            setNotifications(notifications.filter((n) => n.key !== notification.key));
        } catch (err) {
            console.error('Error accepting join request:', err);
            setError(t('Navbar.Errors.Request'));
        }
    };

    // Handle declining a join request (for teachers)
    const handleDecline = async (notification) => {
        if (Role !== 'Teacher') return;
        try {
            const { studentId, groupId, timestamp, teacherId } = notification;
            await axios.delete(
                `http://localhost:4000/api/notifications/join/${studentId}/${groupId}/${timestamp}`,
                { params: { teacherId } }
            );
            setNotifications(notifications.filter((n) => n.key !== notification.key));
        } catch (err) {
            console.error('Error declining join request:', err);
            setError(t('Navbar.Errors.Declining'));
        }
    };

    // Handle deleting a text notification (for students)
    const handleDelete = async (notificationKey) => {
        try {
            if (Role === 'Student') {
                // Encode the notificationKey to handle special characters like ':'
                const encodedNotificationKey = encodeURIComponent(notificationKey);
                await axios.delete(`http://localhost:4000/api/notifications/student/${userId}/${encodedNotificationKey}`);
            }
            // Update the state to remove the notification from the list
            setNotifications(notifications.filter((n) => n.key !== notificationKey));
        } catch (err) {
            console.error('Error deleting notification:', err);
            setError(t('Navbar.Errors.Deleting'));
        }
    };

    const isMobile = useMediaQuery({ maxWidth: 768 });

    return isMobile ? (
        // Mobile Layout
        <div className="notification-list-mobile fixed bg-white z-60 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 relative">
                <h3 className="text-[#120C38] text-3xl font-bold font-['Nunito'] mt-4">
                    {t('Navbar.NotificationList.List')}
                </h3>
                <button onClick={onClose} className="w-6 h-6 flex border-0 items-center justify-center absolute right-1 top-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {/* Notification List */}
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.key}
                            type={notification.type}
                            studentName={notification.studentName}
                            course={notification.course}
                            group={notification.group}
                            date={notification.date}
                            text={notification.text}
                            onAccept={() => handleAccept(notification)}
                            onDecline={() => handleDecline(notification)}
                            onDelete={() => handleDelete(notification.key)}
                            isMobile={true}
                            role={Role}
                        />
                    ))
                ) : (
                    <div className="text-[#120C38] text-xl font-normal font-['Mulish'] text-center">
                        {t('Navbar.NotificationList.NoNew')}
                    </div>
                )}
            </div>
        </div>
    ) : (
        // Desktop Layout
        <div className="absolute top-0 right-10 w-[90vw] sm:w-[332px] bg-white rounded-2xl border border-[#D7D7D7] p-6 z-50 shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#120C38] text-2xl font-bold font-['Nunito']">
                    {t('Navbar.NotificationList.List')}
                </h3>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#120C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.key}
                            type={notification.type}
                            studentName={notification.studentName}
                            course={notification.course}
                            group={notification.group}
                            date={notification.date}
                            text={notification.text}
                            onAccept={() => handleAccept(notification)}
                            onDecline={() => handleDecline(notification)}
                            onDelete={() => handleDelete(notification.key)}
                            isMobile={false}
                            role={Role}
                        />
                    ))
                ) : (
                    <div className="text-[#120C38] text-sm font-normal font-['Mulish'] text-center">
                        {t('Navbar.NotificationList.NoNew')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationList;