import React, { useState } from 'react';

export default function EditEmailAndPassword() {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className='w-full flex justify-center px-4'>
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                <div className="w-full md:relative">
                    {/* Desktop version */}
                    <div className="hidden md:block w-[970px] h-[600px] left-0 top-0 absolute bg-white rounded-[20px]">
                        <div className="w-72 h-6 left-[20px] top-[20px] absolute justify-start text-black text-xl font-normal font-['Mulish']">
                            Особиста інформація
                        </div>

                        <div className="left-[110px] top-[156px] absolute">
                            <img className="size-24 rounded-full object-cover" src={previewImage} alt="Profile" />
                            <label className="w-24 h-7 absolute top-[102px] cursor-pointer flex items-center justify-center rounded-[20px] outline outline-1 outline-[#8a48e6]">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <span className="text-[#8a48e6] text-base font-bold font-['Nunito']">Змінити</span>
                            </label>
                        </div>

                        <div className="absolute left-[330px] top-[66px] flex flex-col gap-[18px]">
                            <div className="relative">
                                <input type="text" name="LastName" value={formData.LastName} onChange={handleInputChange}
                                    className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.LastName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                    placeholder="Прізвище" />
                                {errors.LastName && <div className="text-red-500 text-sm mt-1">{errors.LastName}</div>}
                            </div>

                            <div className="relative">
                                <input type="text" name="FirstName" value={formData.FirstName} onChange={handleInputChange}
                                    className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.FirstName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                    placeholder="Ім'я" />
                                {errors.FirstName && <div className="text-red-500 text-sm mt-1">{errors.FirstName}</div>}
                            </div>

                            <div className="relative">
                                <PatternFormat format="+ ## (###) ###-##-##" mask="_" name="PhoneNumber" value={formData.PhoneNumber}
                                    onValueChange={(values) => handleInputChange({ target: { name: 'PhoneNumber', value: values.value } })}
                                    className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.PhoneNumber ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                    placeholder="+ __ (___) ___-__-__" />
                                {errors.PhoneNumber && <div className="text-red-500 text-sm mt-1">{errors.PhoneNumber}</div>}
                            </div>

                            <div className="relative">
                                <input type="email" name="Email" value={formData.Email} onChange={handleInputChange}
                                    className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.Email ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                    placeholder="Email" />
                                {errors.Email && <div className="text-red-500 text-sm mt-1">{errors.Email}</div>}
                            </div>

                            <div className="relative">
                                <PasswordInput
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Новий пароль"
                                    className={errors.newPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                />
                                {errors.newPassword && <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>}
                            </div>

                            <div className="relative">
                                <PasswordInput
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Підтвердження пароля"
                                    className={errors.confirmPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                />
                                {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                            </div>
                            {/* 
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input type="text" name="SchoolName" value={formData.SchoolName} onChange={handleInputChange}
                                        className={`w-full h-12 p-4 bg-white rounded-2xl outline outline-1 ${errors.SchoolName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder="Школа" />
                                    {errors.SchoolName && <div className="text-red-500 text-sm mt-1">{errors.SchoolName}</div>}
                                </div>
                                <div className="flex-1">
                                    <input type="text" name="Grade" value={formData.Grade} onChange={handleInputChange}
                                        className={`w-full h-12 p-4 bg-white rounded-2xl outline outline-1 ${errors.Grade ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder="Клас" />
                                    {errors.Grade && <div className="text-red-500 text-sm mt-1">{errors.Grade}</div>}
                                </div>
                            </div> */}
                        </div>

                        <div className="w-full flex justify-center items-center absolute bottom-[-60px] left-0">
                            <button onClick={handleSubmit} disabled={isLoading}
                                className="w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                                <span className="text-center text-white text-xl font-medium font-['Nunito']">
                                    {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                                </span>
                            </button>
                            {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                        </div>
                    </div>

                    {/* Mobile version */}
                    <div className="md:hidden w-full max-w-[384px] mx-auto bg-white rounded-[20px] p-5">
                        <div className="text-black text-xl font-normal font-['Mulish'] mb-6">Особиста інформація</div>

                        <div className="flex flex-col items-center mb-8">
                            <img className="size-24 rounded-full object-cover" src={previewImage} alt="Profile" />
                            <label className="w-24 h-7 mt-4 cursor-pointer flex items-center justify-center rounded-[20px] outline outline-1 outline-[#8a48e6]">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                <span className="text-[#8a48e6] text-base font-bold font-['Nunito']">Змінити</span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-4">
                            <input type="text" name="LastName" value={formData.LastName} onChange={handleInputChange}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.LastName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="Прізвище" />
                            {errors.LastName && <div className="text-red-500 text-sm mt-1">{errors.LastName}</div>}

                            <input type="text" name="FirstName" value={formData.FirstName} onChange={handleInputChange}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.FirstName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="Ім'я" />
                            {errors.FirstName && <div className="text-red-500 text-sm mt-1">{errors.FirstName}</div>}

                            <PatternFormat format="+ ## (###) ###-##-##" mask="_" name="PhoneNumber" value={formData.PhoneNumber}
                                onValueChange={(values) => handleInputChange({ target: { name: 'PhoneNumber', value: values.value } })}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.PhoneNumber ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="+ __ (___) ___-__-__" />
                            {errors.PhoneNumber && <div className="text-red-500 text-sm mt-1">{errors.PhoneNumber}</div>}

                            <input type="email" name="Email" value={formData.Email} onChange={handleInputChange}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.Email ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="Email" />
                            {errors.Email && <div className="text-red-500 text-sm mt-1">{errors.Email}</div>}

                            <PasswordInput
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Новий пароль"
                                className={errors.newPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                            />
                            {errors.newPassword && <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>}

                            <PasswordInput
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Підтвердження пароля"
                                className={errors.confirmPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                            />
                            {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}

                            <input type="text" name="SchoolName" value={formData.SchoolName} onChange={handleInputChange}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.SchoolName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="Школа" />
                            {errors.SchoolName && <div className="text-red-500 text-sm mt-1">{errors.SchoolName}</div>}

                            <input type="text" name="Grade" value={formData.Grade} onChange={handleInputChange}
                                className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.Grade ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                placeholder="Клас" />
                            {errors.Grade && <div className="text-red-500 text-sm mt-1">{errors.Grade}</div>}
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center items-center mt-4">
                    <button onClick={handleSubmit} disabled={isLoading}
                        className="w-full md:w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                        <span className="text-center text-white text-xl font-medium font-['Nunito']">
                            {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                        </span>
                    </button>
                    {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                </div>
            </div>
        </div>
    );
}
