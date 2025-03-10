import React from 'react';

export default function EditProfileTeacher() {
    return (
        <div className='main-block w-full h-full grid grid-cols-4 mt-[35px] gap-[20px]'>
            <div className='info-block w-full h-full flex flex-col gap-[20px]'>
                <div className="w-full bg-white rounded-[20px] flex flex-col items-center py-[20px] gap-[10px]">
                    <div className="w-[200px] h-10 px-4 py-2 bg-[#8a48e6] rounded-[40px] inline-flex justify-center items-center">
                        <div className="justify-start text-white text-[15px] font-bold font-['Nunito']">Особиста інформація</div>
                    </div>
                    <div className="w-[200px] h-10 px-4 py-2 bg-white rounded-[40px] border border-[#d7d7d7] inline-flex justify-center items-center">
                        <div className="justify-start text-[#120c38] text-[15px] font-bold font-['Nunito']">Діяльність</div>
                    </div>
                    <div className="w-[200px] h-10 px-4 py-2 bg-white rounded-[40px] border border-[#d7d7d7] inline-flex justify-center items-center">
                        <div className="justify-start text-[#120c38] text-[15px] font-bold font-['Nunito']">Про мене</div>
                    </div>
                    <div className="w-[200px] h-10 px-4 py-2 bg-white rounded-[40px] border border-[#d7d7d7] inline-flex justify-center items-center">
                        <div className="justify-start text-[#120c38] text-[15px] font-bold font-['Nunito']">Соціальні мережі</div>
                    </div>
                </div>
            </div>
            <div className='big-block w-full h-full flex flex-col items-start col-span-3 gap-[20px]'>

            </div>
        </div>
    );
}
