import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmCodeInput from '../../components/ConfirmCodeInput/ConfirmCodeInput';

export default function EditEmailAndPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1: ввод данных, 2: ввод кода
    const [emailAlreadySent, setEmailAlreadySent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmError, setConfirmError] = useState(false);

    const [initialEmail, setInitialEmail] = useState('');

    const [formData, setFormData] = useState({
        NewEmail: '',
        NewPassword: '',
        ConfirmPassword: ''
    });

    useLayoutEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/users/${decoded.id}/credentials`).then(res => {
                    setUserId(decoded.id);
                    setFormData({ NewEmail: res.data.Email });
                    setInitialEmail(res.data.Email);
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
                error: `${t('EditEmailAndPassword.Validation.PasswordLength')}`
            };
        }

        if (!hasLowercase) {
            return {
                isValid: false,
                error: `${t('EditEmailAndPassword.Validation.PasswordLowercase')} (a-z)`
            };
        }
        if (!hasUppercase) {
            return {
                isValid: false,
                error: `${t('EditEmailAndPassword.Validation.PasswordUppercase')} (A-Z)`
            };
        }
        if (!hasDigit) {
            return {
                isValid: false,
                error: `${t('EditEmailAndPassword.Validation.PasswordDigit')} (0-9)`
            };
        }
        if (!hasSpecial) {
            return {
                isValid: false,
                error: `${t('EditEmailAndPassword.Validation.PasswordSpecial')} (!@#$%^&*()_+-=[]{};:'"\\|,.<>/?)`
            };
        }
        if (!allowedChars) {
            return {
                isValid: false,
                error: `${t('EditEmailAndPassword.Validation.PasswordInvalidChars')} (!@#$%^&*()_+-=[]{};:'"\\|,.<>/?)`
            };
        }

        return {
            isValid: true,
            error: null
        };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.NewEmail) {
            newErrors.NewEmail = t('EditEmailAndPassword.Validation.EmailRequired');
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.NewEmail)) {
            newErrors.NewEmail = t('EditEmailAndPassword.Validation.EmailInvalid');
        }

        if (formData.NewPassword) {
            const passwordValidation = validatePassword(formData.NewPassword);
            if (!passwordValidation.isValid) {
                newErrors.NewPassword = passwordValidation.error;
            }
            if (formData.ConfirmPassword !== formData.NewPassword) {
                newErrors.ConfirmPassword = t('EditEmailAndPassword.Validation.PasswordsMismatch');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const sendConfirmationCode = async () => {
        try {
            if (formData.NewEmail === initialEmail && (formData.NewPassword === undefined || formData.NewPassword === '')) {
                toast.info(t('EditEmailAndPassword.Messages.NoChanges'), {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (validateForm()) {
                const sendData = {
                    UserId: userId,
                    NewEmail: formData.NewEmail || null,
                    NewPassword: formData.NewPassword || null,
                };
                await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/users/send-update-credentials-code`, sendData);
                setEmailAlreadySent(true);
                setStep(2);
                toast.success(t('EditEmailAndPassword.Messages.CodeSent'));
            }
        } catch (error) {
            toast.error(`${t('EditEmailAndPassword.Messages.SendCodeError')}: ${error.response?.data?.message}`);
        }
    };

    const handleConfirmCode = async (code) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/users/confirm-update-credentials`, {
                UserId: userId,
                Code: code,
            });
            if (response.status === 200) {
                toast.success(t('EditEmailAndPassword.Messages.UpdateSuccess'));
                setStep(1);
                setFormData({ NewEmail: '', NewPassword: '', ConfirmPassword: '' });
                setEmailAlreadySent(false);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setConfirmError(true);
                toast.error(t('EditEmailAndPassword.Messages.InvalidCode'));
            } else {
                toast.error(t('EditEmailAndPassword.Messages.ConfirmError'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full flex justify-center px-4 relative'>
            <ToastContainer />
            <button onClick={() => navigate('/user/edit')} id="button-back" className="w-12 h-12 p-2 absolute left-[0px] top-[20px] bg-white rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#d7d7d7] hover:bg-[#d7d7d7] hidden xl:inline-flex justify-start items-center gap-2.5">
                <div data-svg-wrapper data-fill="Off" data-plus="Off" data-property-1="Arrow" className="relative">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.66699 16H25.3337M6.66699 16L14.667 24M6.66699 16L14.667 8" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </button>
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                {step === 1 && (
                    <div className="w-full flex flex-col gap-6">
                        {/* Form Container */}
                        <div className="w-full p-5 bg-white rounded-[20px] flex flex-col gap-5">
                            <div className="text-black text-xl font-normal font-['Mulish']">
                                {t('EditEmailAndPassword.Content.Title')}
                            </div>

                            <div className="w-full flex flex-col items-center gap-5 mt-2">
                                <div className="w-full md:w-[550px]">
                                    <input
                                        type="email"
                                        name="NewEmail"
                                        value={formData.NewEmail}
                                        onChange={handleInputChange}
                                        className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.NewEmail ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder={t('EditEmailAndPassword.Placeholders.Email')}
                                    />
                                    {errors.NewEmail && <div className="text-red-500 text-sm mt-1">{errors.NewEmail}</div>}
                                </div>

                                <div className="w-full md:w-[550px]">
                                    <PasswordInput
                                        name="NewPassword"
                                        value={formData.NewPassword}
                                        onChange={handlePasswordInputChange}
                                        placeholder={t('EditEmailAndPassword.Placeholders.NewPassword')}
                                        className={errors.NewPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                    />
                                    {errors.NewPassword && <div className="text-red-500 text-sm mt-1">{errors.NewPassword}</div>}
                                </div>

                                <div className="w-full md:w-[550px]">
                                    <PasswordInput
                                        name="ConfirmPassword"
                                        value={formData.ConfirmPassword}
                                        onChange={handlePasswordInputChange}
                                        placeholder={t('EditEmailAndPassword.Placeholders.ConfirmPassword')}
                                        className={errors.ConfirmPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                    />
                                    {errors.ConfirmPassword && <div className="text-red-500 text-sm mt-1">{errors.ConfirmPassword}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Button Section */}
                        <div className="w-full flex flex-col items-center mt-4 mb-8">
                            <button
                                onClick={sendConfirmationCode}
                                disabled={isLoading}
                                className="w-full md:w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors"
                            >
                                <span className="text-center text-white text-xl font-medium font-['Nunito']">
                                    {isLoading ? t('EditEmailAndPassword.Buttons.Saving') : t('EditEmailAndPassword.Buttons.Save')}
                                </span>
                            </button>
                            {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="confirm-code w-full p-5 bg-white rounded-[20px] flex flex-col gap-5">
                        <h1 className="text-center text-lg">
                            {t('EditEmailAndPassword.Content.CodeSentMessage')}
                        </h1>
                        <h1 className="text-lg mt-8 text-center">
                            <b>{t('EditEmailAndPassword.Content.EnterCode')}</b>
                        </h1>
                        <div className="w-full flex justify-center mt-3">
                            <ConfirmCodeInput isLoading={isLoading} callback={handleConfirmCode} />
                        </div>
                        <div className="w-full flex justify-center mt-2">
                            <h2
                                className={`text-md ${confirmError ? 'text-red-600' : 'text-white'} mt-2`}
                            >
                                {t('EditEmailAndPassword.Content.InvalidCodeMessage')}
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}