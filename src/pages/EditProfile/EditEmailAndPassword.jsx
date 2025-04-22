import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import ConfirmCodeInput from '../../components/ConfirmCodeInput/ConfirmCodeInput';


export default function EditEmailAndPassword() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1: ввод данных, 2: ввод кода
    const [emailAlreadySent, setEmailAlreadySent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmError, setConfirmError] = useState(false);

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
                axios.get(`http://localhost:4000/api/users/${decoded.id}/credentials`).then(res => {
                    setUserId(decoded.id);
                    setFormData({ NewEmail: res.data.Email })
                })

            } catch (error) {
                console.error("Ошибка при расшифровке токена:", error);
            }
        }
    }, [])

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

        if (!formData.Email) {
            newErrors.Email = "Email обов'язковий";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.Email)) {
            newErrors.Email = 'Невірний формат email';
        }

        if (formData.newPassword) {
            const passwordValidation = validatePassword(formData.NewPassword);
            if (!passwordValidation.isValid) {
                newErrors.NewPassword = passwordValidation.error;
            }
            if (formData.ConfirmPassword !== formData.NewPassword) {
                newErrors.confirmPassword = "Паролі не співпадають";
            }
        }

        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
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
            const sendData = {
                UserId: userId,
                NewEmail: formData.NewEmail || null,
                NewPassword: formData.NewPassword || null,
            };
            console.log('sendData', sendData)
            await axios.post('http://localhost:4000/api/users/send-update-credentials-code', sendData);
            setEmailAlreadySent(true);
            setStep(2);
            toast.success('Код підтвердження надіслано на вашу пошту!');
        } catch (error) {
            toast.error(`Помилка при відправці коду: ${error.response?.data?.message}`);
        }
    };

    const handleConfirmCode = async (code) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/users/confirm-update-credentials', {
                UserId: userId,
                Code: code,
            });
            if (response.status === 200) {
                toast.success('Дані успішно оновлено!');
                setStep(1); // Можно перенаправить или сбросить форму
                setFormData({ NewEmail: '', NewPassword: '' });
                setEmailAlreadySent(false);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setConfirmError(true);
                toast.error('Невірний код підтвердження або термін його дії закінчився');
            } else {
                toast.error(error.response?.data?.message || 'Помилка при підтвердженні');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className='w-full flex justify-center px-4'>
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                {step === 1 && (
                        <div className="w-full md:relative">
                            {/* Desktop version */}
                            <div className="w-[970px] p-5 bg-white rounded-[20px] flex flex-col gap-5">
                                <div className="w-72 h-6 justify-start text-black text-xl font-normal font-['Mulish']">
                                    Зміна пошти та паролю
                                </div>

                                <div className="relative mx-[90px]">
                                    <input type="email" name="NewEmail" value={formData.NewEmail} onChange={handleInputChange}
                                        className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.Email ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder="Email" />
                                    {errors.Email && <div className="text-red-500 text-sm mt-1">{errors.Email}</div>}
                                </div>

                                <div className="relative mx-[90px]">
                                    <PasswordInput
                                        name="NewPassword"
                                        value={formData.NewPassword}
                                        onChange={handlePasswordInputChange}
                                        placeholder="Новий пароль"
                                        className={errors.newPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                    />
                                    {errors.newPassword && <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>}
                                </div>

                                <div className="relative mx-[90px]">
                                    <PasswordInput
                                        name="ConfirmPassword"
                                        value={formData.ConfirmPassword}
                                        onChange={handlePasswordInputChange}
                                        placeholder="Підтвердження пароля"
                                        className={errors.confirmPassword ? 'outline-red-500' : 'outline-[#8a48e6]'}
                                    />
                                    {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                                </div>
                            </div>

                            <div className="w-full flex justify-center items-center absolute bottom-[-60px] left-0">
                                <button onClick={sendConfirmationCode} disabled={isLoading}
                                    className="w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                                    <span className="text-center text-white text-xl font-medium font-['Nunito']">
                                        {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                                    </span>
                                </button>
                                {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                            </div>
                        </div>)}
                {step === 2 && (
                    <div className="confirm-code w-[970px] p-5 bg-white rounded-[20px] flex flex-col gap-5">
                        <h1 className="text-center text-lg">
                            Код підтвердження надіслано на адресу <b>{formData.NewEmail || 'ваш поточний email'}</b>
                        </h1>
                        <h1 className="text-lg mt-8 text-center">
                            <b>Введіть код підтвердження</b>
                        </h1>
                        <div className="w-full flex justify-center mt-3">
                            <ConfirmCodeInput isLoading={isLoading} callback={handleConfirmCode} />
                        </div>
                        <div className="big-error-text">
                            <h2
                                className={`text-md ${confirmError ? 'text-red-600' : 'text-white'} ml-1 mt-2 pr-5`}
                            >
                                Код підтвердження не вірний, або термін його дії закінчився
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// const EditEmailAndPassword = () => {
//   const [formData, setFormData] = useState({
//     NewEmail: '',
//     NewPassword: '',
//   });
//   const [step, setStep] = useState(1); // 1: ввод данных, 2: ввод кода
//   const [emailAlreadySent, setEmailAlreadySent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);


//   const [userId, setUserId] = useState({});

//     useLayoutEffect(() => {
//         const token = sessionStorage.getItem("token");
//         if (token) {
//             try {
//                 const decoded = jwtDecode(token);
//                 setUserId(decoded.id);

//             } catch (error) {
//                 console.error("Ошибка при расшифровке токена:", error);
//             }
//         }
//     }, [])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const sendConfirmationCode = async () => {
//     try {
//         const sendData = {
//         UserId: userId,
//         NewEmail: formData.NewEmail || null,
//         NewPassword: formData.NewPassword || null,
//       };
//       console.log('sendData',sendData)
//       await axios.post('http://localhost:4000/api/users/send-update-credentials-code', sendData);
//       setEmailAlreadySent(true);
//       setStep(2);
//       toast.success('Код підтвердження надіслано на вашу пошту!');
//     } catch (error) {
//       toast.error(`Помилка при відправці коду: ${error.response?.data?.message}`);
//     }
//   };

//   const handleConfirmCode = async (code) => {
//     if (isLoading) return;
//     setIsLoading(true);
//     try {
//       const response = await axios.post('http://localhost:4000/api/users/confirm-update-credentials', {
//         UserId: userId,
//         Code: code,
//       });
//       if (response.status === 200) {
//         toast.success('Дані успішно оновлено!');
//         setStep(1); // Можно перенаправить или сбросить форму
//         setFormData({ NewEmail: '', NewPassword: '' });
//         setEmailAlreadySent(false);
//       }
//     } catch (error) {
//       if (error.response?.status === 400) {
//         setConfirmError(true);
//         toast.error('Невірний код підтвердження або термін його дії закінчився');
//       } else {
//         toast.error(error.response?.data?.message || 'Помилка при підтвердженні');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="edit-credentials">
//       {step === 1 && (
//         <div className="edit-credentials-form">
//           <h1 className="text-center text-lg">Зміна email та/або пароля</h1>
//           <div className="form-group">
//             <label>Новий email (залиште порожнім, якщо не змінюєте)</label>
//             <input
//               type="email"
//               name="NewEmail"
//               value={formData.NewEmail}
//               onChange={handleInputChange}
//               className="w-full p-2 border"
//             />
//           </div>
//           <div className="form-group mt-4">
//             <label>Новий пароль (залиште порожнім, якщо не змінюєте)</label>
//             <input
//               type="password"
//               name="NewPassword"
//               value={formData.NewPassword}
//               onChange={handleInputChange}
//               className="w-full p-2 border"
//             />
//           </div>
//           <button
//             onClick={sendConfirmationCode}
//             className="mt-4 bg-blue-500 text-white p-2 rounded"
//             disabled={!formData.NewEmail && !formData.NewPassword}
//           >
//             Надіслати код підтвердження
//           </button>
//         </div>
//       )}
//       {step === 2 && (
//         <div className="confirm-code">
//           <h1 className="text-center text-lg">
//             Код підтвердження надіслано на адресу <b>{formData.NewEmail || 'ваш поточний email'}</b>
//           </h1>
//           <h1 className="text-lg mt-8 text-center">
//             <b>Введіть код підтвердження</b>
//           </h1>
//           <div className="w-full flex justify-center mt-3">
//             <ConfirmCodeInput isLoading={isLoading} callback={handleConfirmCode} />
//           </div>
//           <div className="big-error-text">
//             <h2
//               className={`text-md ${confirmError ? 'text-red-600' : 'text-white'} ml-1 mt-2 pr-5`}
//             >
//               Код підтвердження не вірний, або термін його дії закінчився
//             </h2>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditEmailAndPassword;