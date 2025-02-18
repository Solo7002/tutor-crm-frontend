import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StandartInput from "../../components/Inputs/StandartInput/StandartInput";
import PasswordInput from "../../components/Inputs/PasswordInput/PasswordInput";
import ConfirmCodeInput from "../../components/ConfirmCodeInput/ConfirmCodeInput";
import { PrimaryButton, SecondaryButton } from '../../components/Buttons/Buttons';
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);
    const [emailAlreadySent, setEmailAlreadySent] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        Username: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        confirmPassword: "",
        ImageFilePath: null,
        Role: "",
    });

    const [step1Validation, setStep1Validation] = useState({
        LastName: false,
        FirstName: false,
        Email: false, 
        Password: false,
        confirmPassword: false,
      });
  
      const handleValidationChange = (fieldName, isValid) => {
        setStep1Validation(prev => ({ ...prev, [fieldName]: isValid }));
      };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === "Email") {
            setEmailAlreadySent(false);
        }
    };

    const handlePasswordChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* Validation */

    const validateName = (name) => {
        const errors = [];
        if (!name) {
            errors.push("Порожнє поле");
        }
        return errors;
    };

    const validateEmail = async (email) => {
        const errors = [];
        
        if (!email) {
            errors.push("Це поле не може бути порожнім");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Некоректний email");
        } else {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/search?email=${email}`);
                if (response.status === 200) {
                    errors.push("Користувач з таким email вже існує");
                }
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.error("Ошибка проверки email:", error);
                    errors.push("Помилка перевірки email");
                }
            }
        }
        return errors;
    };

    const validatePassword = (password) => {
        const errors = [];
        if (!password) {
            errors.push("Це поле не може бути порожнім");
        } else if (password.length < 8) {
            errors.push("Пароль повинен містити щонайменше 8 символів");
        }
        return errors;
    };

    const validateConfirmPassword = (password) => {
        const errors = [];
        if (!password) {
            errors.push("Це поле не може бути порожнім");
        } else if (password !== formData.Password) {
            errors.push("Паролі не збігаються");
        }
        return errors;
    };

    /* register navigation */

    const handleNext = (event) => {
        event.preventDefault();

        if (step >= 5) {
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

    /* images */

    const handleOpenPhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (file && file.type.startsWith("image/")) {
            const ReqformData = new FormData();
            ReqformData.append("file", file);

            try {
                const response = await axios.post(
                    "http://localhost:4000/api/files/upload",
                    ReqformData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (formData.ImageFilePath) {
                    const delResponse = await axios.delete(
                        `http://localhost:4000/api/files/delete/${formData.ImageFilePath.split('/').pop()}`
                    );
                    console.log("del response.status: ", delResponse.status);
                }
                console.log("!!! new response.data.url: ", response.data.url);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ImageFilePath: response.data.url,
                }));
            } catch (error) {
                console.error("Error file upload:", error);
            }
        }
    };

    /* role */

    const changeRole = (user_role) => {
        setSelectedRole(user_role);
        setFormData({ ...formData, ["Role"]: user_role });
    }

    /* Confirm email*/

    const sendConfirmationCode = async () => {
        try {
            console.log("sendConfirmationCode");
            await axios.post("http://localhost:4000/api/auth/register-email-code", {
                Username: `${formData.LastName} ${formData.FirstName}`,
                Email: formData.Email
            }).then(() => { setEmailAlreadySent(true); console.log("then"); });
        } catch (error) {
            console.error("Error sending confirmation code:", error);
        }
    };

    useEffect(() => {
        if (step === 4 && !emailAlreadySent) {
            sendConfirmationCode();
        }
        else if (step === 5) {
            sessionStorage.setItem("email", formData.Email);
            sessionStorage.setItem("password", formData.Password);
        }
    }, [step]);

    const handleResendEmail = async (event) => {
        event.preventDefault();
        await sendConfirmationCode();
    };

    const handleConfirmCode = async (code) => {
        if (isLoading) return;

        try {
            const response = await axios.post("http://localhost:4000/api/auth/confirm-email-code", {
                Username: `${formData.LastName} ${formData.FirstName}`,
                Password: formData.Password,
                LastName: formData.LastName,
                FirstName: formData.FirstName,
                Email: formData.Email,
                ImageFilePath: formData.ImageFilePath,
                Role: formData.Role,
                Code: code
            });
            if (response.status === 201) {
                setStep(5);
            }
        }
        catch (error) {
            if (error.response?.status === 400) {
                setConfirmError(true);
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <h2 className="register-title">Реєстрація {step === 5 && ("успішна")}</h2>

            <div className="register-svg-bar-container">
                <svg width="332" height="15" viewBox="0 0 332 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="6" width="75" height="3" fill={step > 1 ? "#8A48E6" : "#D7D7D7"} />
                    <rect x="87" y="6" width="75" height="3" fill={step > 2 ? "#8A48E6" : "#D7D7D7"} />
                    <rect x="165" y="6" width="75" height="3" fill={step > 3 ? "#8A48E6" : "#D7D7D7"} />
                    <rect x="243" y="6" width="75" height="3" fill={step > 4 ? "#8A48E6" : "#D7D7D7"} />
                    <rect x="9" y="6" width="4" height="3" fill="#8A48E6" />
                    <circle cx="7.5" cy="7.5" r="7.5" fill="#8A48E6" />
                    <circle cx="86.5" cy="7.5" r="7.5" fill={step > 1 ? "#8A48E6" : "#D7D7D7"} />
                    <circle cx="165.5" cy="7.5" r="7.5" fill={step > 2 ? "#8A48E6" : "#D7D7D7"} />
                    <circle cx="244.5" cy="7.5" r="7.5" fill={step > 3 ? "#8A48E6" : "#D7D7D7"} />
                    <circle cx="324.5" cy="7.5" r="7.5" fill={step > 4 ? "#8A48E6" : "#D7D7D7"} />
                </svg>
            </div>

            <form className="register-form">
                {step === 1 && (
                    <div className="register-stage-1">
                        <div className="half-input-width-div gap-6">
                            <StandartInput
                                type="text"
                                name="LastName"
                                placeholder="Прізвище"
                                value={formData.LastName}
                                onChange={handleChange}
                                validate={validateName}
                                onValidationChange={handleValidationChange}
                            />
                            <StandartInput
                                type="text"
                                name="FirstName"
                                placeholder="Ім'я"
                                value={formData.FirstName}
                                onChange={handleChange}
                                validate={validateName}
                                onValidationChange={handleValidationChange}
                            />
                        </div>

                        <StandartInput
                            type="email"
                            name="Email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            validate={validateEmail}
                            onValidationChange={handleValidationChange}
                        />

                        <PasswordInput placeholder={"Пароль"} name="Password" value={formData.Password} onChange={handlePasswordChange} validate={validatePassword} onValidationChange={handleValidationChange}/>
                        <PasswordInput placeholder={"Підтвердження пароля"} name="confirmPassword" value={formData.confirmPassword} onChange={handlePasswordChange} validate={validateConfirmPassword} onValidationChange={handleValidationChange}/>
                    </div>
                )}
                {step === 2 && (
                    <div className="register-stage-2">
                        <h2 className="add-photo-text">Додайте фото профілю</h2>

                        <div className="svg-photo-container group">
                            <div
                                className="photo-wrapper"
                                onClick={handleOpenPhotoClick}
                                style={{
                                    backgroundImage: formData.ImageFilePath ? `url(${formData.ImageFilePath})` : "none",
                                }}
                            >
                                {!formData.ImageFilePath && (
                                    <svg className="svg-select-photo" width="219" height="219" viewBox="0 0 219 219" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2.5" y="2.5" width="214" height="214" rx="107" fill="#D7D7D7" stroke="#D7D7D7" strokeWidth="5" />
                                        <path d="M110.228 143.061H81.0609C78.8507 143.061 76.7311 142.183 75.1683 140.62C73.6055 139.057 72.7275 136.937 72.7275 134.727V97.2273C72.7275 95.0172 73.6055 92.8976 75.1683 91.3348C76.7311 89.772 78.8507 88.894 81.0609 88.894H85.2275C87.4377 88.894 89.5573 88.016 91.1201 86.4532C92.6829 84.8904 93.5609 82.7708 93.5609 80.5606C93.5609 79.4556 93.9999 78.3958 94.7813 77.6144C95.5627 76.833 96.6225 76.394 97.7275 76.394H122.728C123.833 76.394 124.892 76.833 125.674 77.6144C126.455 78.3958 126.894 79.4556 126.894 80.5606C126.894 82.7708 127.772 84.8904 129.335 86.4532C130.898 88.016 133.017 88.894 135.228 88.894H139.394C141.604 88.894 143.724 89.772 145.287 91.3348C146.85 92.8976 147.728 95.0172 147.728 97.2273V111.811M126.894 138.894H151.894M139.394 126.394V151.394" stroke="#827FAE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M97.7275 113.894C97.7275 117.209 99.0445 120.389 101.389 122.733C103.733 125.077 106.912 126.394 110.228 126.394C113.543 126.394 116.722 125.077 119.066 122.733C121.411 120.389 122.728 117.209 122.728 113.894C122.728 110.579 121.411 107.399 119.066 105.055C116.722 102.711 113.543 101.394 110.228 101.394C106.912 101.394 103.733 102.711 101.389 105.055C99.0445 107.399 97.7275 110.579 97.7275 113.894Z" stroke="#827FAE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {formData.ImageFilePath && (
                                    <svg className="svg-already-selected-photo" width="219" height="219" viewBox="0 0 219 219" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2.5" y="2.5" width="214" height="214" rx="107" fill="black" stroke="black" strokeWidth="5" />
                                        <path d="M110.228 143.061H81.0609C78.8507 143.061 76.7311 142.183 75.1683 140.62C73.6055 139.057 72.7275 136.937 72.7275 134.727V97.2273C72.7275 95.0172 73.6055 92.8976 75.1683 91.3348C76.7311 89.772 78.8507 88.894 81.0609 88.894H85.2275C87.4377 88.894 89.5573 88.016 91.1201 86.4532C92.6829 84.8904 93.5609 82.7708 93.5609 80.5606C93.5609 79.4556 93.9999 78.3958 94.7813 77.6144C95.5627 76.833 96.6225 76.394 97.7275 76.394H122.728C123.833 76.394 124.892 76.833 125.674 77.6144C126.455 78.3958 126.894 79.4556 126.894 80.5606C126.894 82.7708 127.772 84.8904 129.335 86.4532C130.898 88.016 133.017 88.894 135.228 88.894H139.394C141.604 88.894 143.724 89.772 145.287 91.3348C146.85 92.8976 147.728 95.0172 147.728 97.2273V111.811M126.894 138.894H151.894M139.394 126.394V151.394" stroke="#827FAE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M97.7275 113.894C97.7275 117.209 99.0445 120.389 101.389 122.733C103.733 125.077 106.912 126.394 110.228 126.394C113.543 126.394 116.722 125.077 119.066 122.733C121.411 120.389 122.728 117.209 122.728 113.894C122.728 110.579 121.411 107.399 119.066 105.055C116.722 102.711 113.543 101.394 110.228 101.394C106.912 101.394 103.733 102.711 101.389 105.055C99.0445 107.399 97.7275 110.579 97.7275 113.894Z" stroke="#827FAE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                )}
                {step === 3 && (
                    <div className="register-stage-3">
                        <h2 className="select-role-text">Обери свою роль</h2>

                        <div className="teacher-student-select-div">
                            <div className="role-container" onClick={() => changeRole("Student")}>
                                <img src="/assets/register/student.png" alt="student" className={`rounded-full border-purple-600 ${selectedRole === "Student" ? "border-4 hover:border-4" : "border-0 hover:border-2"}`} />
                                <p className={`text-center mt-2 ${selectedRole === "Student" ? "font-bold" : ""}`}>Учень</p>
                            </div>
                            <div className="role-container" onClick={() => changeRole("Teacher")}>
                                <img src="/assets/register/teacher.png" alt="teacher" className={`rounded-full border-purple-600 ${selectedRole === "Teacher" ? "border-4 hover:border-4" : "border-0 hover:border-2"}`} />
                                <p className={`text-center mt-2 ${selectedRole === "Teacher" ? "font-bold" : ""}`}>Вчитель</p>
                            </div>
                        </div>
                    </div>
                )}
                {step === 4 && (
                    <div className="register-stage-4">
                        <h1 className='text-center text-lg'>Код підтвердження надіслано на адресу <b>{formData.Email}</b></h1>

                        <h1 className='text-lg mt-8 text-center'><b>Введіть код підтвердження</b></h1>

                        <div className='w-full flex justify-center mt-3'>
                            <ConfirmCodeInput isLoading={isLoading} callback={handleConfirmCode} />
                        </div>

                        <div className='big-error-text'>
                            <h2 className={`text-md ${confirmError ? "text-red-600" : "text-white"} ml-1 mt-2 pr-5`}>Код підтвердження не вірний, або термін його дії закінчився</h2>
                        </div>
                    </div>
                )}
                {step === 5 && (
                    <div className="register-step-5">
                        <h2 className="register-confirmed-text">Вітаємо в нашій підводній команді! Досліджуй платформу, налаштовуй свій простір і пірнай до нових відкриттів!</h2>
                        <img src="/assets/register/successfullRegistration.png" alt="" />
                    </div>
                )}

                
            </form>
            <div className='form-buttons'>
                {(step === 1) && (<PrimaryButton onClick={handleNext} disabled={!Object.values(step1Validation).every(val => val)}>Далі</PrimaryButton>)}
                {(step === 1) && (<SecondaryButton onClick={handlePrev}>Авторизація</SecondaryButton>)}

                {(step === 2) && (<PrimaryButton onClick={handleNext}>Далі</PrimaryButton>)}
                {(step === 2) && (<SecondaryButton onClick={handlePrev}>Назад</SecondaryButton>)}

                {(step === 3) && (<PrimaryButton onClick={handleNext} disabled={!selectedRole}>Далі</PrimaryButton>)}
                {(step === 3) && (<SecondaryButton onClick={handlePrev}>Назад</SecondaryButton>)}

                {(step === 4) && (<PrimaryButton onClick={handleResendEmail}>Повторно надіслати листа</PrimaryButton>)}
                {(step === 4) && (<SecondaryButton onClick={handlePrev}>Назад</SecondaryButton>)}

                {(step === 5) && (<PrimaryButton onClick={handleNext}>Авторизація</PrimaryButton>)}
            </div>
        </div>
    );
};

export default Register;