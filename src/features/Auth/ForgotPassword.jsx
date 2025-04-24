import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import StandartInput from "../../components/Inputs/StandartInput/StandartInput";
import { PrimaryButton, SecondaryButton } from '../../components/Buttons/Buttons';
import "./ForgotPassword.css";
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [Email, setEmail] = useState("");

    const [step1Validation, setStep1Validation] = useState({
        Email: false
    });

    const validateEmail = async (Email) => {
        const errors = [];

        if (!Email) {
            errors.push("Це поле не може бути порожнім");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
            errors.push("Некоректний email");
        } else {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/users/search?email=${Email}`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                });
                if (response.status === 404) {
                    errors.push("Користувача з таким email не існує");
                }
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    toast.error("Сталася помилка, спробуйте ще раз");
                    errors.push("Помилка перевірки email");
                } else if (error.response.status === 404) {
                    errors.push("Користувача з таким email не існує");
                }
            }
        }
        return errors;
    };

    const handleValidationChange = (fieldName, isValid) => {
        setStep1Validation(prev => ({ ...prev, [fieldName]: isValid }));
    };

    const handleSendEmail = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/auth/reset-password-new`, { Email }, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        }).then(() => {setStep(2)});
      } catch (error) {
        toast.error("Сталася помилка, спробуйте ще раз");
      }
    };

    const handleNext = (event) => {
        event.preventDefault();

        if (step >= 2) {
            navigate("/auth/login");
            return;
        }

        setStep((prev) => prev + 1);
    }

    const handlePrev = (event) => {
        event.preventDefault();
        if (step <= 1) {
            navigate("/auth/login");
            return;
        }

        setStep((prev) => prev - 1);
    }

    return (
        <div className='forgot-page'>
            <h2 className="forgot-title">Відновлення паролю</h2>

            {step === 1 && (
                <div className='step-1'>
                    <h2 className="under-header-text">Для зміни пароля введіть вашу електронну пошту. Ми надішлемо вам новий пароль.</h2>
                    <div className='mt-[30%]'>
                        <StandartInput
                            type="email"
                            name="Email"
                            placeholder="Email"
                            value={Email}
                            onChange={(e) => {setEmail(e.target.value)}}
                            validate={validateEmail}
                            onValidationChange={handleValidationChange}
                        />  
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className='step-2'>
                    <h2 className="under-header-text mt-6">Вітаємо! Ваш новий тимчасовий пароль було надіслано на вашу електронну пошту. Тепер Ви можете увійти в систему використовуючи тимчасовий пароль, і змінити його у своєму особистому кабінеті</h2>
                    <img src="/assets/register/successfullRegistration.png" alt="" className="mt-5"/>
                </div>
            )}

            <div className='form-buttons'>
                {step === 1 && (<PrimaryButton onClick={handleSendEmail} disabled={!Object.values(step1Validation).every(val => val)}>Далі</PrimaryButton>)}
                {step === 1 && (<SecondaryButton onClick={handlePrev}>Авторизація</SecondaryButton>)}

                {step === 2 && (<PrimaryButton onClick={handleNext} disabled={!Object.values(step1Validation).every(val => val)}>Авторизація</PrimaryButton>)}
            </div>
        </div>
    );
}

export default ForgotPassword;