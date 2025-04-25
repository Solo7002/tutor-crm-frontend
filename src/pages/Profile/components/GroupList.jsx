import React from 'react';
import '../ProfileStudent.css';
import { useTranslation } from 'react-i18next';

const GroupList = ({ groups: initialGroups, userFrom = null }) => {
    const { t } = useTranslation();

    // Используем переданные курсы или дефолтные с правильной структурой
    const groups = initialGroups?.length ? initialGroups : [
        { 
            GroupId: -1, 
            GroupName: t('ProfileStudent.GroupList.DefaultGroups.MathName'), 
            GroupFormat: t('ProfileStudent.GroupList.DefaultGroups.MathFormat'), 
            GroupType: t('ProfileStudent.GroupList.DefaultGroups.MathType'), 
            GroupTeacherName: t('ProfileStudent.GroupList.DefaultGroups.MathTeacher'), 
            GroupPrice: 200 
        },
        { 
            GroupId: -2, 
            GroupName: t('ProfileStudent.GroupList.DefaultGroups.PhysicsName'), 
            GroupFormat: t('ProfileStudent.GroupList.DefaultGroups.PhysicsFormat'), 
            GroupType: t('ProfileStudent.GroupList.DefaultGroups.PhysicsType'), 
            GroupTeacherName: t('ProfileStudent.GroupList.DefaultGroups.PhysicsTeacher'), 
            GroupPrice: 150 
        },
    ];

    // Компонент для десктопного вида таблицы
    const DesktopTableView = ({ groups }) => (
        <div className="hidden md:block w-full mt-4">
            <div className="grid grid-cols-5 gap-2 text-[#8a48e6] text-sm lg:text-[15px] font-bold font-['Nunito']">
                <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('ProfileStudent.GroupList.TableHeaders.Number')}</div>
                <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('ProfileStudent.GroupList.TableHeaders.GroupName')}</div>
                <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('ProfileStudent.GroupList.TableHeaders.CourseName')}</div>
                <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('ProfileStudent.GroupList.TableHeaders.Teacher')}</div>
                <div className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('ProfileStudent.GroupList.TableHeaders.Price')}</div>
            </div>
            <div className="mt-2 space-y-3">
                {groups.map((group) => (
                    <div key={group.GroupId} className="grid grid-cols-5 gap-2 text-[#827ead] text-sm lg:text-[15px] font-normal font-['Mulish'] border-t border-[#f5eeff] pt-3">
                        <div className="text-[#827ead] text-base font-normal font-['Mulish']">{group.GroupId}</div>
                        <div className="text-[#827ead] text-base font-normal font-['Mulish']">{group.GroupName}</div>
                        <div className="text-[#827ead] text-base font-normal font-['Mulish']">{group.CourseName}</div>
                        <div className="text-[#827ead] text-base font-normal font-['Mulish']">{group.GroupTeacherName}</div>
                        <div className="text-[#827ead] text-base font-normal font-['Mulish']">{group.GroupPrice} грн</div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Компонент для мобильного вида таблицы
    const MobileTableView = ({ groups }) => (
        <div className="md:hidden w-full mt-4 space-y-4">
            {groups.map((group) => (
                <div key={group.GroupId} className="bg-[#f9f6ff] p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-[#8a48e6] text-sm font-bold">{t('ProfileStudent.GroupList.TableHeaders.GroupNumber')}:</div>
                        <div className="text-[#827ead] text-sm">{group.GroupId}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">{t('ProfileStudent.GroupList.TableHeaders.GroupName')}:</div>
                        <div className="text-[#827ead] text-sm">{group.GroupName}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">{t('ProfileStudent.GroupList.TableHeaders.Teacher')}:</div>
                        <div className="text-[#827ead] text-sm">{group.GroupTeacherName}</div>
                        <div className="text-[#8a48e6] text-sm font-bold">{t('ProfileStudent.GroupList.TableHeaders.Price')}:</div>
                        <div className="text-[#827ead] text-sm">{group.GroupPrice} грн</div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full bg-white rounded-[20px] flex flex-col items-center transition-all duration-300 min-h-[268px] p-2 sm:p-4">
            <h2 className="text-[#120c38] text-xl sm:text-2xl font-bold font-['Nunito'] my-3 sm:my-5">{t('ProfileStudent.GroupList.Title')}</h2>

            <div className="w-full sm:w-[95%] md:w-[90%] flex flex-col gap-3 sm:gap-4">
                <>
                    <DesktopTableView groups={groups} />
                    <MobileTableView groups={groups} />
                </>
            </div>
        </div>
    );
};

export default GroupList;