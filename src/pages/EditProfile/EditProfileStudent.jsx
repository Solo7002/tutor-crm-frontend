import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { PatternFormat } from 'react-number-format';
import PasswordInput from '../../components/PasswordInput/PasswordInput';

export default function EditProfileStudent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        LastName: '',
        FirstName: '',
        Email: '',
        PhoneNumber: '',
        SchoolName: '',
        Grade: '',
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                axios.get(`http://localhost:4000/api/students/${decoded.id}/info`)
                    .then(res => {
                        const { user, student } = res.data;
                        setFormData({
                            LastName: user.LastName || '',
                            FirstName: user.FirstName || '',
                            Email: user.Email || '',
                            PhoneNumber: user.PhoneNumber || '',
                            SchoolName: student.SchoolName || '',
                            Grade: student.Grade || '',
                        });
                        setPreviewImage(user.ImageFilePath || `https://ui-avatars.com/api/?name=${user.LastName + ' ' + user.FirstName}&background=random&size=86`);
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const validatePassword = (password) => {
        const minLength = 8;
        const maxLength = 128;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password);
        const allowedChars = /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/.test(password);
    
        if (password.length < minLength || password.length > maxLength) {
            return {
                isValid: false,
                error: `Пароль має містити від ${minLength} до ${maxLength} символів`
            };
        }
    
        if (!hasLowercase) {
            return {
                isValid: false,
                error: "Пароль має містити хоча б одну малу літеру (a-z)"
            };
        }
        if (!hasUppercase) {
            return {
                isValid: false,
                error: "Пароль має містити хоча б одну велику літеру (A-Z)"
            };
        }
        if (!hasDigit) {
            return {
                isValid: false,
                error: "Пароль має містити хоча б одну цифру (0-9)"
            };
        }
        if (!hasSpecial) {
            return {
                isValid: false,
                error: "Пароль має містити хоча б один спеціальний символ (!@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)"
            };
        }
        if (!allowedChars) {
            return {
                isValid: false,
                error: "Пароль містить недопустимі символи. Дозволені лише букви, цифри та спеціальні символи: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?"
            };
        }
    
        return {
            isValid: true,
            error: null
        };
    };

    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.LastName) newErrors.LastName = "Прізвище обов'язкове";
        if (!formData.FirstName) newErrors.FirstName = "Ім'я обов'язкове";
        if (!formData.Email) {
            newErrors.Email = "Email обов'язковий";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.Email)) {
            newErrors.Email = 'Невірний формат email';
        }
    
        const phoneDigits = formData.PhoneNumber.replace(/[^0-9]/g, '');
        if (phoneDigits.length > 0 && phoneDigits.length < 10) {
            newErrors.PhoneNumber = "Номер телефону має містити мінімум 10 цифр";
        }
    
        if (formData.SchoolName && (formData.SchoolName.length < 1 || formData.SchoolName.length > 255)) {
            newErrors.SchoolName = "Назва школи має бути від 1 до 255 символів";
        }
    
        if (formData.Grade && (formData.Grade.length < 1 || formData.Grade.length > 50)) {
            newErrors.Grade = "Клас має бути від 1 до 50 символів";
        }
    
        if (passwordData.newPassword) {
            const passwordValidation = validatePassword(passwordData.newPassword);
            if (!passwordValidation.isValid) {
                newErrors.newPassword = passwordValidation.error;
            }
            if (passwordData.confirmPassword !== passwordData.newPassword) {
                newErrors.confirmPassword = "Паролі не співпадають";
            }
        }
    
        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword) {
            console.log("New Password:", passwordData.newPassword);
            try {
                const token = sessionStorage.getItem("token");
                await axios.post('http://localhost:4000/api/auth/change-password', {
                    newPassword: passwordData.newPassword
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                setErrors({ submit: 'Помилка при зміні пароля: ' + (error.response?.data?.message || error.message) });
                throw error;
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const formData = new FormData();
        formData.append('file', imageFile);
        try {
            const response = await axios.post('http://localhost:4000/api/files/uploadAndReturnLink', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.fileUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await handlePasswordChange();

            const token = sessionStorage.getItem("token");
            const decoded = jwtDecode(token);
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage();
            }

            const updateData = {
                user: {
                    LastName: formData.LastName,
                    FirstName: formData.FirstName,
                    Email: formData.Email,
                    ...(imageUrl && { ImageFilePath: imageUrl })
                },
                student: {
                    SchoolName: formData.SchoolName,
                    Grade: formData.Grade
                },
                phone: formData.PhoneNumber ? { PhoneNumber: formData.PhoneNumber } : null
            };

            await axios.put(`http://localhost:4000/api/students/profile/${decoded.id}`, updateData);
            window.location.href = '/student/profile';
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ submit: 'Помилка при оновленні профілю: ' + (error.response?.data?.error || error.message) });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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