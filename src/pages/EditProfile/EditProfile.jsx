import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { PatternFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

export default function EditProfile() {
    const navigate = useNavigate();
      const { t } = useTranslation();
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
    const [role, setRole] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                axios.get(`http://localhost:4000/api/users/${decoded.id}/profile`)
                    .then(res => {
                        const user = res.data;
                        const initialData = {
                            LastName: user.LastName || '',
                            FirstName: user.FirstName || '',
                            PhoneNumber: user.PhoneNumber || ''
                        };
                        setRole(user.Role);
                        setFormData(initialData);
                        setInitialFormData(initialData);
                        setPreviewImage(user.ImageFilePath || `https://ui-avatars.com/api/?name=${user.LastName + ' ' + user.FirstName}&background=random&size=86`);
                        setInitialImageFile(null);
                    })
                    .catch(error => {
                        toast.error(t('Navbar.Errors.UserData'));
                    });
            } catch (error) {
                toast.error(t('Navbar.Errors.TokenDecode'));
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
                error: `${t('EditProfile.Validation.ChooseImage')} (JPEG, PNG, GIF, BMP, WebP, SVG, ICO, TIFF)`
            };
        }
        return { isValid: true, error: null };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.LastName) newErrors.LastName = t('EditProfile.Validation.LastName');
        if (!formData.FirstName) newErrors.FirstName = t('EditProfile.Validation.FirstName');

        const phoneDigits = formData.PhoneNumber.replace(/[^0-9]/g, '');
        if (phoneDigits.length > 0 && phoneDigits.length < 10) {
            newErrors.PhoneNumber = t('EditProfile.Validation.PhoneNumber');
        }

        if (imageFile) {
            const imageValidation = validateImage(imageFile);
            if (!imageValidation.isValid) {
                newErrors.image = imageValidation.error;
            }
        }

        setErrors(newErrors);
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
            toast.error(t('EditProfile.Validation.UploadImage'));
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
                oldValue: initialImageFile ? t('EditProfile.Validation.initialImageFile') : t('EditProfile.Validation.noImage'),
                newValue: imageFile ? t('EditProfile.Validation.imageFile') : t('EditProfile.Validation.noImage')
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
                        <h3 className="font-bold">{t('EditProfile.ChangedFields')}:</h3>
                        <ul className="list-disc pl-5">
                            {changes.map((change, index) => (
                                <li key={index}>
                                    <strong>{change.field}:</strong> {t('EditProfile.ChangedFrom')} "{change.oldValue}" {t('EditProfile.ChangedTo')} "{change.newValue}"
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
                navigate(`/${role.toLowerCase()}/profile`);
            } else {
                toast.info(t('EditProfile.NoChanges'), {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            // console.error('Error updating profile:', error);
            setErrors({ submit: `${t('EditProfile.Errors.ProfileUpdate')}: ` + (error.response?.data?.error || error.message) });
            toast.error(`${t('EditProfile.Errors.ProfileUpdate')}!`, {
                position: "bottom-right",
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
        <div className='w-full flex justify-center px-4 relative'>
            <button onClick={() => navigate(`/${role.toLowerCase()}/profile`)} id="button-back" class="w-12 h-12 p-2 absolute left-[0px] top-[20px] bg-white rounded-[40px] outline outline-1 outline-offset-[-1px] outline-[#d7d7d7] hover:bg-[#d7d7d7] hidden xl:inline-flex justify-start items-center gap-2.5">
                <div data-svg-wrapper data-fill="Off" data-plus="Off" data-property-1="Arrow" class="relative">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.66699 16H25.3337M6.66699 16L14.667 24M6.66699 16L14.667 8" stroke="#120C38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
            </button>
            <ToastContainer />
            <div className='w-full md:w-[970px] flex flex-col gap-6 py-4'>
                <div className="w-full bg-white rounded-[20px] p-5 md:p-6">
                    {/* Personal Information Section */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Title */}
                        <div className="w-full mb-4 md:mb-0">
                            <h2 className="text-black text-xl font-normal font-['Mulish']">
                                {t('EditProfile.Info')}
                            </h2>
                        </div>
                    </div>

                    {/* Profile Content Container */}
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-6 md:mb-0 md:w-40">
                            <img className="size-24 rounded-full object-cover mb-4" src={previewImage} alt="Profile" />
                            <div className="relative">
                                <label className="w-24 h-7 cursor-pointer flex items-center justify-center rounded-[20px] outline outline-1 outline-[#8a48e6]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <span className="text-[#8a48e6] text-base font-bold font-['Nunito']">{t('EditProfile.Change')}</span>
                                </label>
                                {errors.image && <div className="text-red-500 text-sm mt-1 text-center">{errors.image}</div>}
                            </div>
                        </div>

                        {/* Form Fields Section */}
                        <div className="flex-grow">
                            <div className="flex flex-col gap-[18px]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="LastName"
                                        value={formData.LastName}
                                        onChange={handleInputChange}
                                        className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.LastName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder={t('EditProfile.Placeholders.LastName')}
                                    />
                                    {errors.LastName && <div className="text-red-500 text-sm mt-1">{errors.LastName}</div>}
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="FirstName"
                                        value={formData.FirstName}
                                        onChange={handleInputChange}
                                        className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.FirstName ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder={t('EditProfile.Placeholders.LastName')}
                                    />
                                    {errors.FirstName && <div className="text-red-500 text-sm mt-1">{errors.FirstName}</div>}
                                </div>

                                <div className="relative">
                                    <PatternFormat
                                        format="+ ## (###) ###-##-##"
                                        mask="_"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onValueChange={(values) => handleInputChange({ target: { name: 'PhoneNumber', value: values.value } })}
                                        className={`w-full h-14 p-4 bg-white rounded-2xl outline outline-1 ${errors.PhoneNumber ? 'outline-red-500' : 'outline-[#8a48e6]'} text-[#120c38] text-base font-normal font-['Mulish']`}
                                        placeholder="+ __ (___) ___-__-__"
                                    />
                                    {errors.PhoneNumber && <div className="text-red-500 text-sm mt-1">{errors.PhoneNumber}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="w-full flex flex-col gap-5 mt-5 items-center">
                    <button
                        onClick={() => navigate('/user/edit/credentials')}
                        disabled={isLoading}
                        className="w-full md:w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors"
                    >
                        <span className="text-center text-white text-xl font-medium font-['Nunito']">
                            {t('EditProfile.Buttons.Credentials')}
                        </span>
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full md:w-96 h-12 px-10 py-2 bg-[#8a4ae6] rounded-2xl flex justify-center items-center gap-2.5 overflow-hidden hover:bg-[#632DAE] transition-colors"
                    >
                        <span className="text-center text-white text-xl font-medium font-['Nunito']">
                            {isLoading ? t('EditProfile.Buttons.Saving') : t('EditProfile.Buttons.Save')}
                        </span>
                    </button>
                    {errors.submit && <div className="text-red-500 text-sm text-center mt-2">{errors.submit}</div>}
                </div>
            </div>
        </div>
    );
}