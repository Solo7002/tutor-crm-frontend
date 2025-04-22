import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { PatternFormat } from 'react-number-format';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfileStudent() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        LastName: '',
        FirstName: '',
        PhoneNumber: '',
    });
    const [initialFormData, setInitialFormData] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [initialImageFile, setInitialImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                axios.get(`http://localhost:4000/api/users/${decoded.id}/profile`)
                    .then(res => {
                        console.log('res.data',res.data)
                        const user = res.data;
                        const initialData = {
                            LastName: user.LastName || '',
                            FirstName: user.FirstName || '',
                            PhoneNumber: user.PhoneNumber || ''
                        };
                        setFormData(initialData);
                        setInitialFormData(initialData);
                        setPreviewImage(user.ImageFilePath || `https://ui-avatars.com/api/?name=${user.LastName + ' ' + user.FirstName}&background=random&size=86`);
                        setInitialImageFile(null);
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const validateImage = (file) => {
        if (!file) return { isValid: true, error: null };
        const validImageTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'image/webp',
            'image/svg+xml',
            'image/x-icon',
            'image/tiff',
            'image/heic',
            'image/heif',
            'image/avif',
            'image/jp2',
            'image/jpx',
            'image/jpm',
            'image/mj2',
            'image/x-ms-bmp',
            'image/x-xbitmap',
            'image/x-xpixmap',
            'image/x-portable-anymap',
            'image/x-portable-bitmap',
            'image/x-portable-graymap',
            'image/x-portable-pixmap',
            'image/x-rgb',
            'image/x-tga',
            'image/x-pcx',
            'image/x-cmu-raster',
            'image/x-exr',
            'image/x-hdr',
            'image/x-sgi',
            'image/vnd.wap.wbmp',
            'image/vnd.microsoft.icon',
            'image/vnd.radiance',
            'image/vnd.zbrush.pcx',
            'image/apng',
            'image/flif'
        ];
        if (!validImageTypes.includes(file.type)) {
            return {
                isValid: false,
                error: 'Будь ласка, виберіть файл зображення (JPEG, PNG, GIF, BMP, WebP, SVG, ICO, TIFF)'
            };
        }
        return { isValid: true, error: null };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.LastName) newErrors.LastName = "Прізвище обов'язкове";
        if (!formData.FirstName) newErrors.FirstName = "Ім'я обов'язкове";

        const phoneDigits = formData.PhoneNumber.replace(/[^0-9]/g, '');
        if (phoneDigits.length > 0 && phoneDigits.length < 10) {
            newErrors.PhoneNumber = "Номер телефону має містити мінімум 10 цифр";
        }

        if (imageFile) {
            const imageValidation = validateImage(imageFile);
            if (!imageValidation.isValid) {
                newErrors.image = imageValidation.error;
            }
        }

        setErrors(newErrors);
        console.log("Validation errors:", newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validation = validateImage(file);
            if (validation.isValid) {
                setImageFile(file);
                setPreviewImage(URL.createObjectURL(file));
                setErrors(prev => ({ ...prev, image: '' }));
            } else {
                setErrors(prev => ({ ...prev, image: validation.error }));
                setImageFile(null);
                setPreviewImage(formData.LastName && formData.FirstName
                    ? `https://ui-avatars.com/api/?name=${formData.LastName + ' ' + formData.FirstName}&background=random&size=86`
                    : previewImage);
            }
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

    const detectChanges = () => {
        const changes = [];

        for (const key in formData) {
            if (formData[key] !== initialFormData[key]) {
                changes.push({
                    field: key,
                    oldValue: initialFormData[key],
                    newValue: formData[key]
                });
            }
        }

        if (imageFile !== initialImageFile) {
            changes.push({
                field: 'Profile Image',
                oldValue: initialImageFile ? 'Попереднє зображення' : 'Без зображення',
                newValue: imageFile ? 'Нове зображення завантажено' : 'Без зображення'
            });
        }

        return changes;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
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
                phone: formData.PhoneNumber ? { PhoneNumber: formData.PhoneNumber } : null
            };

            await axios.put(`http://localhost:4000/api/users/${decoded.id}/profile`, updateData);

            const changes = detectChanges();
            if (changes.length > 0) {
                const toastMessage = (
                    <div>
                        <h3 className="font-bold">Змінені поля:</h3>
                        <ul className="list-disc pl-5">
                            {changes.map((change, index) => (
                                <li key={index}>
                                    <strong>{change.field}:</strong> Змінено з "{change.oldValue}" на "{change.newValue}"
                                </li>
                            ))}
                        </ul>
                    </div>
                );
                toast.success(toastMessage, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.info("Жодних змін не внесено.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            window.location.href = '/student/profile';
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ submit: 'Помилка при оновленні профілю: ' + (error.response?.data?.error || error.message) });
            toast.error('Помилка при оновленні профілю!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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

    return (
        <div className='w-full flex justify-center px-4'>
            <ToastContainer />
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                <div className="w-full md:relative">
                    {/* Desktop version */}
                    <div className="hidden md:block w-[970px] h-[350px] bg-white rounded-[20px]">
                        <div className="w-72 h-6 left-[20px] top-[20px] absolute justify-start text-black text-xl font-normal font-['Mulish']">
                            Особиста інформація
                        </div>

                        <div className="left-[110px] top-[126px] absolute">
                            <img className="size-24 rounded-full object-cover" src={previewImage} alt="Profile" />
                            <label className="w-24 h-7 absolute top-[102px] cursor-pointer flex items-center justify-center rounded-[20px] outline outline-1 outline-[#8a48e6]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <span className="text-[#8a48e6] text-base font-bold font-['Nunito']">Змінити</span>
                            </label>
                            {errors.image && <div className="text-red-500 text-sm mt-1 text-center">{errors.image}</div>}
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

                            {/* <div className="relative">
                                <input type="email" name="Email" value={formData.Email} onChange={handleInputChange}
                                    className={`w-[550px] h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.Email ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                    placeholder="Email" />
                                {errors.Email && <div className="text-red-500 text-sm mt-1">{errors.Email}</div>}
                            </div> */}
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
                    </div>

                        <div className="w-full flex flex-col gap-5 mt-5 justify-center items-center">
                            <button onClick={() => window.location.href = '/user/edit/credentials'} disabled={isLoading}
                                className="w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                                <span className="text-center text-white text-xl font-medium font-['Nunito']">
                                    Змінити пароль та/або пошту
                                </span>
                            </button>
                            <button onClick={handleSubmit} disabled={isLoading}
                                className="w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                                <span className="text-center text-white text-xl font-medium font-['Nunito']">
                                    {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                                </span>
                            </button>
                            {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                        </div>

                    {/* Mobile version */}
                    <div className="md:hidden w-full max-w-[384px] mx-auto bg-white rounded-[20px] p-5">
                        <div className="text-black text-xl font-normal font-['Mulish'] mb-6">Особиста інформація</div>

                        <div className="flex flex-col items-center mb-8">
                            <img className="size-24 rounded-full object-cover" src={previewImage} alt="Profile" />
                            <label className="w-24 h-7 mt-4 cursor-pointer flex items-center justify-center rounded-[20px] outline outline-1 outline-[#8a48e6]">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/x-icon,image/tiff"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <span className="text-[#8a48e6] text-base font-bold font-['Nunito']">Змінити</span>
                            </label>
                            {errors.image && <div className="text-red-500 text-sm mt-1 text-center">{errors.image}</div>}
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

                            {/* <PasswordInput
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
                            /> */}
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

                {/* <div className="w-full flex justify-center items-center mt-4">
                    <button onClick={handleSubmit} disabled={isLoading}
                        className="w-full md:w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors">
                        <span className="text-center text-white text-xl font-medium font-['Nunito']">
                            {isLoading ? 'Збереження...' : 'Зберегти зміни'}
                        </span>
                    </button>
                    {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                </div> */}
            </div>
        </div>
    );
}