import { Link } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { MyContext } from "../../App";

const UploadImage = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

    const context = useContext(MyContext);

    // انتخاب فایل‌ها
    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setSelectedFiles(files);
        
        // ایجاد پیش‌نمایش
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            urls.push(URL.createObjectURL(files[i]));
        }
        setPreviewUrls(urls);
    };

    // آپلود تصاویر
    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفاً ابتدا تصاویر را انتخاب کنید!'
            });
            return;
        }

        setUploading(true);

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/upload/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setUploadedImages(prev => [...prev, ...response.data.imageUrls]);
                setSelectedFiles([]);
                setPreviewUrls([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'تصاویر با موفقیت آپلود شدند!'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در آپلود تصاویر!'
                });
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در آپلود تصاویر!'
            });
        } finally {
            setUploading(false);
        }
    };

    // حذف تصویر از پیش‌نمایش
    const removePreview = (index) => {
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        const newFiles = Array.from(selectedFiles).filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
    };

    return (
        <>
            <div className="right-content w-100 gallery-page-wrapper">
                <div className="LogPage">
                    <div className="card breadCrumb shadow border-0 mt-1 gallery-breadcrumb">
                        <div className="d-flex align-items-center py-2 px-4">
                            <h4 className="mx-3">آپلود تصویر</h4>
                            <div className="me-auto d-flex align-items-center">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/gallery/upload'>افزودن تصویر</Link></span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 mt-3 formCard">
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">آپلود تصویر جدید</h5>
                            <p className="text-muted mb-3">تصاویر خود را انتخاب کنید و سپس روی دکمه آپلود کلیک کنید.</p>
                            
                            {/* باکس آپلود */}
                            <div className="imgUploadBox d-flex align-items-center flex-wrap">
                                {/* نمایش پیش‌نمایش تصاویر انتخاب شده */}
                                {previewUrls?.length !== 0 &&
                                    previewUrls.map((img, index) => (
                                        <div className="uploadBox" key={index}>
                                            <span className="remove" onClick={() => removePreview(index)}>
                                                <IoCloseSharp />
                                            </span>
                                            <img src={img} className="w-100" alt={`preview-${index}`} />
                                        </div>
                                    ))
                                }

                                {/* باکس انتخاب فایل (فقط زمانی که فایلی انتخاب نشده) */}
                                {previewUrls.length === 0 && (
                                    <div className="uploadBox">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            multiple 
                                            onChange={handleFileSelect} 
                                            name="images" 
                                            disabled={uploading} 
                                            accept="image/*"
                                        />
                                        <div className="info">
                                            <FaRegImages />
                                            <h5 className="mt-1">انتخاب تصاویر</h5>
                                            <small className="text-muted">JPEG, PNG, WEBP</small>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* نمایش تعداد فایل‌های انتخاب شده */}
                            {previewUrls.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">
                                        {previewUrls.length} تصویر انتخاب شده
                                    </small>
                                </div>
                            )}

                            <br />

                            {/* دکمه آپلود تمام عریض */}
                            <button 
                                className="btn btn-primary w-100 py-3"
                                onClick={handleUpload}
                                disabled={uploading || previewUrls.length === 0}
                            >
                                {uploading ? (
                                    <>
                                        <CircularProgress size={20} sx={{ color: 'white', marginRight: '10px' }} />
                                        در حال آپلود...
                                    </>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt className="me-2" />
                                        آپلود تصاویر
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadImage;