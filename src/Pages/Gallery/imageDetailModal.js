import { useState, useEffect, useContext } from "react";
import { 
    FiDownload, 
    FiExternalLink, 
    FiHeart, 
    FiX, 
    FiSave,
    FiImage,
    FiFolder,
    FiLink,
    FiCheckCircle,
    FiXCircle,
    FiCheck,
    FiLink2
} from "react-icons/fi";
import { 
    validateItemId, 
    linkImageToItem, 
    unlinkImageFromItem,
    updateImageMetadata,
    toggleLikeImage 
} from "../../utils/api";
import { MyContext } from "../../App";

const ImageDetailModal = ({ image, isOpen, onClose, onRefresh }) => {
    const [imageData, setImageData] = useState({
        name: '',
        alt: '',
        type: 'products',
        linkedId: '',
        linkedName: '',
        isLinked: false,
        originalLinkedId: '',
        originalLinkedType: '',
        originalLinkedName: '',
        originalName: '',
        originalAlt: ''
    });
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [isLinking, setIsLinking] = useState(false);
    const [isSavingMetadata, setIsSavingMetadata] = useState(false);
    const [linkMessage, setLinkMessage] = useState(null);
    const [isLinkedCheckbox, setIsLinkedCheckbox] = useState(false);
    const [showUnlinkWarning, setShowUnlinkWarning] = useState(false);
    const [hasMetadataChanged, setHasMetadataChanged] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isTogglingLike, setIsTogglingLike] = useState(false);

    const context = useContext(MyContext);

    useEffect(() => {
        if (image) {
            let type = 'products';
            let linkedId = '';
            let linkedName = '';
            let isLinked = false;
            let originalLinkedId = '';
            let originalLinkedType = '';
            let originalLinkedName = '';
            
            if (image.usedInCourses && image.courseInfo) {
                type = 'courses';
                linkedId = image.courseInfo.id || '';
                linkedName = image.courseInfo.name || '';
                isLinked = true;
                originalLinkedId = image.courseInfo.id || '';
                originalLinkedType = 'courses';
                originalLinkedName = image.courseInfo.name || '';
            } else if (image.usedInProducts && image.productInfo) {
                type = 'products';
                linkedId = image.productInfo.id || '';
                linkedName = image.productInfo.name || '';
                isLinked = true;
                originalLinkedId = image.productInfo.id || '';
                originalLinkedType = 'products';
                originalLinkedName = image.productInfo.name || '';
            } else if (image.usedInCourses) {
                type = 'courses';
                linkedId = image.linkedId || '';
                isLinked = true;
                originalLinkedId = image.linkedId || '';
                originalLinkedType = 'courses';
                originalLinkedName = image.linkedName || '';
            } else if (image.usedInProducts) {
                type = 'products';
                linkedId = image.linkedId || '';
                isLinked = true;
                originalLinkedId = image.linkedId || '';
                originalLinkedType = 'products';
                originalLinkedName = image.linkedName || '';
            }

            const displayName = image.displayName || image.name || '';
            const altText = image.alt || '';

            setImageData({
                name: displayName,
                alt: altText,
                type: type,
                linkedId: linkedId,
                linkedName: linkedName,
                isLinked: isLinked,
                originalLinkedId: originalLinkedId,
                originalLinkedType: originalLinkedType,
                originalLinkedName: originalLinkedName,
                originalName: displayName,
                originalAlt: altText
            });
            setIsLinkedCheckbox(isLinked);
            setHasMetadataChanged(false);
            setIsLiked(image.liked || false);
            setValidationResult(isLinked ? { 
                found: true, 
                item: { name: linkedName, id: linkedId },
                message: `✅ ${linkedName}`
            } : null);
            setShowUnlinkWarning(false);
            setLinkMessage(null);
        }
    }, [image]);

    if (!isOpen || !image) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'name' || name === 'alt') {
            const originalValue = name === 'name' ? imageData.originalName : imageData.originalAlt;
            if (value !== originalValue) {
                setHasMetadataChanged(true);
            } else {
                const otherField = name === 'name' ? 'alt' : 'name';
                const otherValue = name === 'name' ? imageData.alt : imageData.name;
                const otherOriginal = name === 'name' ? imageData.originalAlt : imageData.originalName;
                if (otherValue !== otherOriginal) {
                    setHasMetadataChanged(true);
                } else {
                    setHasMetadataChanged(false);
                }
            }
        }
        
        setImageData({
            ...imageData,
            [name]: value
        });
        
        if (name === 'linkedId') {
            setValidationResult(null);
            setLinkMessage(null);
        }
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsLinkedCheckbox(checked);
        
        if (!checked && image.usageCount > 0) {
            setShowUnlinkWarning(true);
            setImageData({
                ...imageData,
                linkedId: '',
                linkedName: '',
                isLinked: false
            });
            setValidationResult(null);
        } else if (checked) {
            setShowUnlinkWarning(false);
            
            if (imageData.originalLinkedId) {
                setImageData({
                    ...imageData,
                    linkedId: imageData.originalLinkedId,
                    linkedName: imageData.originalLinkedName || '',
                    isLinked: true
                });
                if (imageData.originalLinkedName) {
                    setValidationResult({
                        found: true,
                        item: { 
                            name: imageData.originalLinkedName, 
                            id: imageData.originalLinkedId 
                        },
                        message: `✅ ${imageData.originalLinkedName}`
                    });
                }
            } else {
                setImageData({
                    ...imageData,
                    isLinked: false
                });
            }
        } else {
            setShowUnlinkWarning(false);
            setImageData({
                ...imageData,
                linkedId: '',
                linkedName: '',
                isLinked: false
            });
            setValidationResult(null);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(image.url, {
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const extension = contentType.split('/')[1] || 'jpg';
            
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageData.name || `image.${extension}`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
            
        } catch (error) {
            console.error('Error downloading image:', error);
            window.open(image.url, '_blank');
        }
    };

    const handleOpenInNewTab = () => {
        window.open(image.url, '_blank');
    };

    const handleValidateId = async () => {
        const { linkedId, type } = imageData;
        if (!linkedId || linkedId.trim() === '') {
            setValidationResult({ found: false, message: 'لطفاً شناسه را وارد کنید' });
            return;
        }

        setIsValidating(true);
        try {
            const result = await validateItemId(type === 'courses' ? 'course' : 'product', linkedId);
            if (result.success && result.found) {
                setValidationResult({
                    found: true,
                    item: result.item,
                    message: `✅ ${result.item.name}`
                });
                setImageData({
                    ...imageData,
                    linkedName: result.item.name
                });
            } else {
                setValidationResult({
                    found: false,
                    message: '0 یافت شد'
                });
                setImageData({
                    ...imageData,
                    linkedName: ''
                });
            }
        } catch (error) {
            setValidationResult({
                found: false,
                message: 'خطا در بررسی'
            });
        } finally {
            setIsValidating(false);
        }
    };

    const handleLikeToggle = async () => {
        if (isTogglingLike) return;
        
        setIsTogglingLike(true);
        try {
            const result = await toggleLikeImage(image.key, image.url);
            if (result.success) {
                setIsLiked(result.liked);
                image.liked = result.liked;
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در تغییر وضعیت لایک!'
                });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در تغییر وضعیت لایک!'
            });
        } finally {
            setIsTogglingLike(false);
        }
    };

    const handleSaveMetadata = async () => {
        setIsSavingMetadata(true);
        try {
            const result = await updateImageMetadata(
                image.key,
                image.url,
                {
                    name: imageData.name,
                    alt: imageData.alt
                }
            );
            
            if (result.success) {
                setImageData(prev => ({
                    ...prev,
                    originalName: prev.name,
                    originalAlt: prev.alt
                }));
                setHasMetadataChanged(false);
                return true;
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: result.message || 'خطا در ذخیره اطلاعات تصویر!'
                });
                return false;
            }
        } catch (error) {
            console.error('Error saving metadata:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در ذخیره اطلاعات تصویر!'
            });
            return false;
        } finally {
            setIsSavingMetadata(false);
        }
    };

    const handleSave = async () => {
        // Save metadata if changed
        if (hasMetadataChanged) {
            const metadataSaved = await handleSaveMetadata();
            if (!metadataSaved) {
                return;
            }
        }

        // CASE 1: Image is linked and checkbox is checked (already linked - just update metadata)
        if (imageData.originalLinkedId && isLinkedCheckbox) {
            if (hasMetadataChanged) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'اطلاعات تصویر با موفقیت به‌روزرسانی شد!'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'هیچ تغییری برای ذخیره وجود ندارد.'
                });
            }
            if (onRefresh) onRefresh();
            onClose();
            return;
        }

        // CASE 2: Image was linked and checkbox is unchecked - UNLINK
        if (imageData.originalLinkedId && !isLinkedCheckbox) {
            setIsLinking(true);
            try {
                const type = imageData.originalLinkedType === 'courses' ? 'course' : 'product';
                const result = await unlinkImageFromItem(image.url, type, imageData.originalLinkedId);

                if (result.success) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'تصویر با موفقیت از آیتم جدا شد!'
                    });
                    if (onRefresh) onRefresh();
                    onClose();
                } else {
                    if (result.isOnlyImage) {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: 'این آیتم فقط یک عکس دارد! برای جلوگیری از خالی بودن، حداقل یک عکس باید وجود داشته باشد.'
                        });
                        setIsLinkedCheckbox(true);
                        setShowUnlinkWarning(false);
                        setImageData(prev => ({
                            ...prev,
                            linkedId: prev.originalLinkedId,
                            linkedName: prev.originalLinkedName || '',
                            isLinked: true
                        }));
                        setValidationResult({
                            found: true,
                            item: { name: imageData.originalLinkedName, id: imageData.originalLinkedId },
                            message: `✅ ${imageData.originalLinkedName}`
                        });
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: result.message || 'خطا در جدا کردن تصویر!'
                        });
                    }
                }
            } catch (error) {
                console.error('Error unlinking image:', error);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در جدا کردن تصویر!'
                });
            } finally {
                setIsLinking(false);
            }
            return;
        }

        // CASE 3: Checkbox is unchecked (image is unused or will be left unused)
        if (!isLinkedCheckbox) {
            if (hasMetadataChanged) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'اطلاعات تصویر با موفقیت ذخیره شد!'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'تصویر بدون استفاده باقی ماند.'
                });
            }
            if (onRefresh) onRefresh();
            onClose();
            return;
        }

        // CASE 4: Checkbox is checked but no ID (for unused image)
        if (!imageData.linkedId || imageData.linkedId.trim() === '') {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفاً شناسه محصول/دوره را وارد کنید!'
            });
            return;
        }

        if (!validationResult || !validationResult.found) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'شناسه وارد شده معتبر نیست! لطفاً ابتدا آن را بررسی کنید.'
            });
            return;
        }

        // CASE 5: Link image to new item (only for unused images)
        setIsLinking(true);
        try {
            const type = imageData.type === 'courses' ? 'course' : 'product';
            const result = await linkImageToItem(image.url, type, imageData.linkedId);

            if (result.success) {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'تصویر با موفقیت به آیتم متصل شد!'
                });
                if (onRefresh) onRefresh();
                onClose();
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: result.message || 'خطا در اتصال تصویر!'
                });
            }
        } catch (error) {
            console.error('Error linking image:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در اتصال تصویر!'
            });
        } finally {
            setIsLinking(false);
        }
    };

    const getUsageText = () => {
        if (image.usedInCourses && image.usedInProducts) {
            return 'استفاده شده در دوره و محصول';
        } else if (image.usedInCourses) {
            return `استفاده شده در دوره: ${image.courseInfo?.name || ''}`;
        } else if (image.usedInProducts) {
            return `استفاده شده در محصول: ${image.productInfo?.name || ''}`;
        } else {
            return 'بدون استفاده';
        }
    };

    const getLinkedTypeLabel = () => {
        if (imageData.type === 'courses') {
            return 'دوره';
        } else {
            return 'محصول';
        }
    };

    const isIdInputDisabled = () => {
        if (imageData.originalLinkedId && isLinkedCheckbox && imageData.isLinked) {
            return true;
        }
        return false;
    };

    const isTypeDisabled = () => {
        if (imageData.originalLinkedId && isLinkedCheckbox && imageData.isLinked) {
            return true;
        }
        return false;
    };

    const isSaveDisabled = () => {
        if (isLinking) return true;
        if (isSavingMetadata) return true;
        
        if (imageData.originalLinkedId && isLinkedCheckbox) {
            return !hasMetadataChanged;
        }
        
        if (isLinkedCheckbox && !imageData.originalLinkedId && !validationResult?.found) return true;
        
        return false;
    };

    const getSaveButtonText = () => {
        if (isSavingMetadata) return 'در حال ذخیره اطلاعات...';
        if (isLinking) return 'در حال پردازش...';
        
        if (imageData.originalLinkedId && isLinkedCheckbox) {
            if (hasMetadataChanged) {
                return 'ذخیره تغییرات (نام/توضیح)';
            }
            return 'هیچ تغییری یافت نشد';
        }
        
        if (imageData.originalLinkedId && !isLinkedCheckbox) return 'جدا کردن از آیتم';
        if (!isLinkedCheckbox) return 'ذخیره (بدون استفاده)';
        if (!validationResult?.found) return 'ابتدا شناسه را بررسی کنید';
        return 'ذخیره و اتصال';
    };

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
                
                <button className="image-modal-close" onClick={onClose}>
                    <FiX />
                </button>

                <div className="image-modal-content">
                    <div className="image-modal-preview">
                        <img 
                            src={image.url} 
                            alt={imageData.alt || image.name}
                            className="image-modal-preview-img"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                                e.target.alt = 'Image not found';
                            }}
                        />
                        <div className="image-modal-preview-overlay">
                            <span className="image-modal-preview-name">{imageData.name || image.name}</span>
                            <span className="image-modal-preview-size">
                                {formatFileSize(image.size)} • {getUsageText()}
                            </span>
                        </div>
                    </div>

                    <div className="image-modal-details">
                        <h3 className="image-modal-details-title">جزئیات تصویر</h3>

                        <div className="image-modal-actions">
                            <button 
                                className="image-modal-action-btn" 
                                onClick={handleDownload}
                                title="دانلود تصویر"
                            >
                                <FiDownload />
                            </button>
                            {/* دکمه لینک به دوره/محصول - فقط برای تصاویر استفاده شده */}
                            <button 
                                className={`image-modal-action-btn image-modal-link-action-btn ${imageData.linkedId ? 'active' : 'disabled'}`}
                                onClick={() => {
                                    const type = imageData.type === 'courses' ? 'courses' : 'products';
                                    const id = imageData.linkedId;
                                    if (id) {
                                        window.open(`/${type}/${id}`, '_blank');
                                    }
                                }}
                                title={imageData.linkedId ? `مشاهده ${getLinkedTypeLabel()}` : 'متصل به هیچ آیتمی نیست'}
                                disabled={!imageData.linkedId}
                            >
                                <FiExternalLink />
                            </button>
                            <button 
                                className={`image-modal-action-btn image-modal-action-btn-heart ${isLiked ? 'liked' : ''}`}
                                onClick={handleLikeToggle}
                                disabled={isTogglingLike}
                                title={isLiked ? 'حذف لایک' : 'لایک'}
                            >
                                <FiHeart fill={isLiked ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        <div className="image-modal-usage-badge">
                            <span className={`usage-badge ${image.usageCount > 0 ? 'used' : 'unused'}`}>
                                {image.usageCount > 0 ? (
                                    <>
                                        <FiCheckCircle />
                                        {getUsageText()}
                                    </>
                                ) : (
                                    <>
                                        <FiXCircle />
                                        بدون استفاده
                                    </>
                                )}
                            </span>
                            {image.usageCount > 0 && (
                                <span className="usage-count">
                                    {image.usageCount} مورد استفاده
                                </span>
                            )}
                            {isLiked && (
                                <span className="usage-count liked-badge">
                                    ❤️ لایک شده
                                </span>
                            )}
                        </div>

                        <div className="image-modal-field">
                            <label className="image-modal-field-label">
                                <FiImage className="image-modal-field-icon" />
                                نام عکس
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="image-modal-field-input"
                                value={imageData.name}
                                onChange={handleInputChange}
                                placeholder="نام تصویر را وارد کنید..."
                            />
                        </div>

                        <div className="image-modal-field">
                            <label className="image-modal-field-label">
                                <FiImage className="image-modal-field-icon" />
                                توضیح کوتاه (Alt)
                            </label>
                            <textarea
                                name="alt"
                                className="image-modal-field-textarea"
                                value={imageData.alt}
                                onChange={handleInputChange}
                                placeholder="توضیح کوتاه برای تصویر..."
                                rows="2"
                            />
                        </div>

                        <div className="image-modal-field">
                            <label className="image-modal-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isLinkedCheckbox}
                                    onChange={handleCheckboxChange}
                                    className="image-modal-checkbox"
                                />
                                <span className="image-modal-checkbox-text">
                                    <FiLink />
                                    {imageData.isLinked && isLinkedCheckbox ? 
                                        `متصل به ${getLinkedTypeLabel()}` : 
                                        `اتصال به ${getLinkedTypeLabel()}`
                                    }
                                </span>
                            </label>
                            {showUnlinkWarning && (
                                <div className="image-modal-warning">
                                    <FiLink2 />
                                    <span>در صورت جدا کردن، می‌توانید به آیتم دیگری متصل کنید یا بدون استفاده بگذارید.</span>
                                </div>
                            )}
                        </div>

                        {isLinkedCheckbox && (
                            <>
                                <div className="image-modal-field-row">
                                    <div className="image-modal-field image-modal-field-half">
                                        <label className="image-modal-field-label">
                                            <FiFolder className="image-modal-field-icon" />
                                            نوع
                                        </label>
                                        <select
                                            name="type"
                                            className="image-modal-field-select"
                                            value={imageData.type}
                                            onChange={handleInputChange}
                                            disabled={isTypeDisabled()}
                                        >
                                            <option value="products">محصولات</option>
                                            <option value="courses">دوره‌ها</option>
                                        </select>
                                        {isTypeDisabled() && (
                                            <small className="image-modal-field-hint">
                                                * برای تغییر نوع، ابتدا اتصال را قطع کنید
                                            </small>
                                        )}
                                    </div>

                                    <div className="image-modal-field image-modal-field-half">
                                        <label className="image-modal-field-label">
                                            <FiLink className="image-modal-field-icon" />
                                            شناسه {getLinkedTypeLabel()}
                                        </label>
                                        <div className="image-modal-id-wrapper">
                                            <input
                                                type="text"
                                                name="linkedId"
                                                className="image-modal-field-input image-modal-field-id"
                                                value={imageData.linkedId}
                                                onChange={handleInputChange}
                                                placeholder="شناسه را وارد کنید..."
                                                disabled={isIdInputDisabled()}
                                                onBlur={handleValidateId}
                                            />
                                            {!isIdInputDisabled() && (
                                                <button 
                                                    className="image-modal-validate-btn"
                                                    onClick={handleValidateId}
                                                    disabled={isValidating || !imageData.linkedId}
                                                    title="بررسی شناسه"
                                                >
                                                    {isValidating ? '...' : <FiCheck />}
                                                </button>
                                            )}
                                        </div>
                                        {validationResult && (
                                            <div className={`validation-result ${validationResult.found ? 'success' : 'error'}`}>
                                                {validationResult.found ? (
                                                    <>
                                                        <FiCheckCircle />
                                                        <span className="validation-name">{validationResult.item.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiXCircle />
                                                        <span>{validationResult.message}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {isIdInputDisabled() && imageData.linkedName && (
                                            <small className="image-modal-field-hint image-modal-field-hint-success">
                                                ✅ متصل به: {imageData.linkedName}
                                            </small>
                                        )}
                                        {isIdInputDisabled() && (
                                            <small className="image-modal-field-hint">
                                                * برای تغییر شناسه، ابتدا اتصال را قطع کنید
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="image-modal-footer">
                            <button className="image-modal-btn image-modal-btn-secondary" onClick={onClose}>
                                انصراف
                            </button>
                            <button 
                                className="image-modal-btn image-modal-btn-primary" 
                                onClick={handleSave}
                                disabled={isSaveDisabled()}
                            >
                                <FiSave />
                                {getSaveButtonText()}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
};

export default ImageDetailModal;