import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GrGallery } from "react-icons/gr";
import { GiBookmark } from "react-icons/gi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FiTrash2, FiDownload, FiRefreshCw, FiFolder, FiImage, FiCheckCircle, FiXCircle, FiHeart } from "react-icons/fi";
import { getGalleryImages, deleteGalleryImage, getGalleryStats, toggleLikeImage } from "../../utils/api";
import ImageDetailModal from "./imageDetailModal";
import { MyContext } from "../../App";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalImages, setTotalImages] = useState(0);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'courses', 'products', 'unused'
    const [stats, setStats] = useState(null);

    const context = useContext(MyContext);
    
    // Modal state
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchImages();
        fetchStats();
    }, [selectedFilter]);

    const fetchImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getGalleryImages(selectedFilter);
            if (response.success) {
                setImages(response.images);
                setTotalImages(response.total);
            } else {
                setError('خطا در دریافت تصاویر');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('خطا در دریافت تصاویر');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getGalleryStats();
            if (response.success) {
                setStats(response.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (imageKey) => {
        if (!window.confirm('آیا از حذف این تصویر مطمئن هستید؟')) return;
        
        setDeleting(true);
        try {
            const response = await deleteGalleryImage(imageKey);
            if (response.success) {
                setImages(images.filter(img => img.key !== imageKey));
                setTotalImages(prev => prev - 1);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'تصویر با موفقیت حذف شد!'
                });
                fetchStats();
                fetchImages();
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: response.message || 'خطا در حذف تصویر!'
                });
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در حذف تصویر!'
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleDownload = async (imageUrl, imageName) => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageName || 'image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading image:', error);
            window.open(imageUrl, '_blank');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // ============================================
    // تابع برای استخراج نام فایل از لینک
    // ============================================
    const getFileNameFromUrl = (url) => {
        if (!url) return 'بدون نام';
        try {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1] || url;
            // اگر نام فایل طولانی است، کوتاه کن
            if (fileName.length > 30) {
                return fileName.substring(0, 27) + '...';
            }
            return fileName;
        } catch {
            return url;
        }
    };

    // ============================================
    // تابع برای نمایش نام هوشمند تصویر
    // ============================================
    const getDisplayName = (image) => {
        // اگر displayName وجود دارد و خالی نیست، از آن استفاده کن
        if (image.displayName && image.displayName.trim() !== '') {
            return image.displayName;
        }
        
        // اگر name وجود دارد
        if (image.name) {
            // اگر name یک لینک کامل است، نام فایل را استخراج کن
            if (image.name.includes('http') || image.name.includes('/')) {
                return getFileNameFromUrl(image.name);
            }
            return image.name;
        }
        
        return 'بدون نام';
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        fetchStats();
        fetchImages();
    };

    const filteredImages = images.filter(img => {
        const displayName = getDisplayName(img);
        return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // تابع لایک کردن تصویر
    const handleLikeToggle = async (image) => {
        try {
            const response = await toggleLikeImage(image.key, image.url);
            if (response.success) {
                // به‌روزرسانی وضعیت لایک در لیست تصاویر
                setImages(prev => prev.map(img => 
                    img.key === image.key 
                        ? { ...img, liked: response.liked } 
                        : img
                ));
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: response.liked ? 'تصویر لایک شد!' : 'لایک تصویر برداشته شد!'
                });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: response.message || 'خطا در تغییر وضعیت لایک!'
                });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در تغییر وضعیت لایک!'
            });
        }
    };

    return (
        <>
            <div className="right-content w-100 gallery-page-wrapper">
                <div className="LogPage">
                    <div className="card breadCrumb shadow border-0 mt-1 gallery-breadcrumb">
                        <div className="d-flex align-items-center py-2 px-4">
                            <h4 className="mx-3">گالری تصاویر</h4>
                            <div className="me-auto d-flex align-items-center">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/gallery'>گالری</Link></span>
                            </div>
                        </div>
                    </div>
 
                    <div className="infoSection">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #1da256, #48d483)' }}>
                                    <h4 className="text-white mb-0">همه عکس‌ها :</h4>
                                    <span className="text-white">{stats?.totalImages || 0}</span>
                                    <div className="icon">
                                        <GrGallery />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #c012e2, #eb64fb)' }}>
                                    <h4 className="text-white mb-0">دوره‌ها :</h4>
                                    <span className="text-white">{stats?.usage?.courseImages || 0}</span>
                                    <div className="icon">
                                        <GiBookmark />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #2c75e8, #60aff5)' }}>
                                    <h4 className="text-white mb-0">محصولات :</h4>
                                    <span className="text-white">{stats?.usage?.productImages || 0}</span>
                                    <div className="icon">
                                        <MdOutlineProductionQuantityLimits />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    {stats && (
                        <div className="stats-section mt-3 p-3">
                            <div className="row text-center">
                                <div className="col-4">
                                    <div className="stat-item">
                                        <small className="stat-label">حجم کل</small>
                                        <p className="stat-value">{stats.totalSize}</p>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="stat-item">
                                        <small className="stat-label">در حال استفاده</small>
                                        <p className="stat-value text-success">{stats.usage?.usedImages || 0}</p>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="stat-item">
                                        <small className="stat-label">بدون استفاده</small>
                                        <p className="stat-value text-danger">{stats.usage?.unusedImages || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gallery Section */}
                    <div className="gallery-section mt-4 p-3">
                        <div className="gallery-header">
                            <h5>تصاویر ذخیره شده</h5>
                            <div className="gallery-controls">
                                {/* Filter Dropdown */}
                                <select 
                                    className="form-select"
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    style={{ width: '180px' }}
                                >
                                    <option value="all">همه تصاویر</option>
                                    <option value="courses">تصاویر دوره‌ها</option>
                                    <option value="products">تصاویر محصولات</option>
                                    <option value="unused">عکس‌های استفاده نشده</option>
                                </select>
                                
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="جستجوی تصویر..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '160px' }}
                                />
                                
                                <button 
                                    className="btn-refresh"
                                    onClick={fetchImages}
                                    disabled={loading}
                                >
                                    <FiRefreshCw className={loading ? 'spinning' : ''} />
                                    {loading ? 'در حال بارگذاری...' : 'بروزرسانی'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="gallery-error">{error}</div>
                        )}

                        {loading ? (
                            <div className="gallery-loading">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p>در حال بارگذاری تصاویر...</p>
                            </div>
                        ) : filteredImages.length === 0 ? (
                            <div className="gallery-empty">
                                <FiImage size={48} />
                                <h5>{searchTerm ? 'تصویری با این نام یافت نشد' : 'هیچ تصویری در این دسته یافت نشد'}</h5>
                                <p>
                                    {selectedFilter === 'courses' && 'هیچ تصویری به دوره‌ها اختصاص داده نشده است'}
                                    {selectedFilter === 'products' && 'هیچ تصویری به محصولات اختصاص داده نشده است'}
                                    {selectedFilter === 'unused' && 'همه تصاویر به دوره یا محصول متصل شده‌اند'}
                                    {selectedFilter === 'all' && 'تصویری در گالری وجود ندارد'}
                                </p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {filteredImages.map((image, index) => (
                                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                        <div className="image-card">
                                            <div className="image-wrapper" onClick={() => handleImageClick(image)} style={{ cursor: 'pointer' }}>
                                                <img 
                                                    src={image.url} 
                                                    alt={getDisplayName(image)}
                                                    className="w-100"
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg';
                                                        e.target.alt = 'Image not found';
                                                    }}
                                                />
                                                {/* Usage Badge - Bottom Left */}
                                                {image.usageCount > 0 && (
                                                    <span className="position-absolute start-0 m-2 badge bg-success">
                                                        <FiCheckCircle className="me-1" />
                                                        در حال استفاده
                                                    </span>
                                                )}
                                                {image.usageCount === 0 && (
                                                    <span className="position-absolute start-0 m-2 badge bg-secondary">
                                                        <FiXCircle className="me-1" />
                                                        بدون استفاده
                                                    </span>
                                                )}
                                                {/* Like Badge - Top Right */}
                                                {/*image.liked && (
                                                    <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
                                                        <FiHeart className="me-1" fill="currentColor" />
                                                        لایک شده
                                                    </span>
                                                )*/}
                                            </div>
                                            {/* دکمه لایک - همیشه نمایش داده میشه برای تصاویر لایک شده */}
                                                {/*<button 
                                                    className={`btn-action btn-like ${image.liked ? 'liked' : 'd-none'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // تابع لایک رو اینجا صدا بزن
                                                        handleLikeToggle(image);
                                                    }}
                                                    title={image.liked ? 'حذف لایک' : 'لایک'}
                                                >
                                                    <FiHeart fill={image.liked ? 'currentColor' : 'none'} />
                                                </button>*/}
                                            <div className="image-actions">
                                                <button 
                                                    className="btn-action btn-delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(image.key);
                                                    }}
                                                    disabled={deleting || image.usageCount > 0}
                                                    title={image.usageCount > 0 ? 'این تصویر در حال استفاده است' : 'حذف تصویر'}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <button 
                                                    className="btn-action btn-download"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(image.url, getDisplayName(image));
                                                    }}
                                                    title="دانلود تصویر"
                                                >
                                                    <FiDownload />
                                                </button>
                                            </div>
                                            <div className="image-info">
                                                <span className="image-name" title={getDisplayName(image)}>
                                                    <FiFolder size={12} />
                                                    {getDisplayName(image)}
                                                </span>
                                                <div className="image-meta">
                                                    <span>{formatFileSize(image.size)}</span>
                                                    <span>{new Date(image.lastModified).toLocaleDateString('fa-IR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {filteredImages.length > 0 && (
                            <div className="gallery-footer">
                                <span className="result-count">
                                    نمایش {filteredImages.length} از {images.length} تصویر
                                </span>
                                <span className="result-count">
                                    {images.filter(img => img.usageCount > 0).length} در حال استفاده
                                </span>
                                <span className="result-count liked-count">
                                    ❤️ {images.filter(img => img.liked).length} لایک شده
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Image Detail Modal */}
            <ImageDetailModal 
                image={selectedImage}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onRefresh={fetchImages}
            />
        </>
    );
}

export default Gallery;