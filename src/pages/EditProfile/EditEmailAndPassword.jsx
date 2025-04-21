import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function EditEmailAndPassword() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useLayoutEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                axios.get(`http://localhost:4000/api/teachers/${decoded.id}/info`).then(res => {
                    console.log('user',res.data.user)
                    setUser(res.data.user);
                })

            } catch (error) {
                console.error("Ошибка при расшифровке токена:", error);
            }
        }
    }, [])

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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await handlePasswordChange();

            const token = sessionStorage.getItem("token");
            const decoded = jwtDecode(token);

            const updateData = {
                user: {
                    Email: formData.Email
                }
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

    return (
        <div className='w-full flex justify-center px-4'>
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                <div className="w-full md:relative">
                    {/* Desktop version */}
                    <div className="hidden md:block w-[970px] h-[600px] left-0 top-0 absolute bg-white rounded-[20px]">
                        <div className="w-72 h-6 left-[20px] top-[20px] absolute justify-start text-black text-xl font-normal font-['Mulish']">
                            Зміна пошти та паролю
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
            </div>
        </div>
    );
}
