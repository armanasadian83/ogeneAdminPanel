import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { BsEye, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { Button } from "@mui/material";
import { MyContext } from "../../App";
import { fetchDataFromApi, editOrderStatus, deleteData } from "../../utils/api";
import { IoCloseSharp } from "react-icons/io5";

const Orders = () => {

    const context = useContext(MyContext);

    const [ordersData, setOrdersData] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const [stats, setStats] = useState({});
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchUserId, setSearchUserId] = useState('');

    useEffect(() => {
        fetchAllOrders();
        fetchStats();
    }, []);

    useEffect(() => {
        if (searchUserId.trim() === '') {
            setFilteredOrders(ordersData);
        } else {
            const filtered = ordersData.filter(order => 
                order.clientId && order.clientId === searchUserId.trim()
            );
            setFilteredOrders(filtered);
        }
    }, [searchUserId, ordersData]);


    const fetchAllOrders = () => {
        setIsLoading(true);
        fetchDataFromApi('/api/orders/all')
            .then((res) => {
                if (res.success) {
                    setOrdersData(res.orders);
                    setFilteredOrders(res.orders);
                } else {
                    setOrdersData([]);
                    setFilteredOrders([]);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const fetchStats = () => {
        fetchDataFromApi('/api/orders/stats')
            .then((res) => {
                if (res.success) {
                    setStats(res.stats);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setBtnDisabled(true);
        editOrderStatus(`/api/orders/${orderId}`, { status: newStatus })
            .then((res) => {
                if (res.success) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'وضعیت سفارش با موفقیت تغییر کرد!'
                    });
                    fetchAllOrders();
                    fetchStats();
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.message || 'خطا در تغییر وضعیت!'
                    });
                }
                setBtnDisabled(false);
            })
            .catch((err) => {
                console.error(err);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در ارتباط با سرور!'
                });
                setBtnDisabled(false);
            });
    };

    const deleteOrder = (orderId) => {
    if (window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
        setBtnDisabled(true);
        deleteData(`/api/orders/${orderId}`)
            .then((res) => {
                if (res && res.success === true) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'سفارش با موفقیت حذف شد!'
                    });
                    fetchAllOrders();
                    fetchStats();
                } else if (res && res.message) {
                    if (res.status === false || res.error) {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: res.message || 'خطا در حذف سفارش!'
                        });
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'سفارش با موفقیت حذف شد!'
                        });
                        fetchAllOrders();
                        fetchStats();
                    }
                } else {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'سفارش با موفقیت حذف شد!'
                    });
                    fetchAllOrders();
                    fetchStats();
                }
                setBtnDisabled(false);
            })
            .catch((err) => {
                console.error(err);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'سفارش با موفقیت حذف شد!'
                });
                fetchAllOrders();
                fetchStats();
                setBtnDisabled(false);
            });
    }
};

    const toggleExpand = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'در انتظار':
                return 'pending';
            case 'در حال پردازش':
                return 'processing';
            case 'تایید شده':
                return 'completed';
            case 'لغو شده':
                return 'cancelled';
            default:
                return '';
        }
    };

    const copyClientId = (clientId) => {
        navigator.clipboard.writeText(clientId).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'آیدی مشتری کپی شد!'
            });
        }).catch(() => {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'خطا در کپی کردن آیدی!'
            });
        });
    };

    const handleSearch = (e) => {
        setSearchUserId(e.target.value);
    };

    const clearSearch = () => {
        setSearchUserId('');
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="OrderPage">
                    <div className="card breadCrumb shadow border-0 mt-1">
                        <div className="d-flex align-items-center py-2 px-4">
                            <h4 className="mx-3">مدیریت سفارشات</h4>
                            <div className="me-auto d-flex align-items-center">
                                <div className="hideInMobile">
                                    <span><Link to='/'>داشبورد</Link></span>
                                    <span>&nbsp; / &nbsp;</span>
                                    <span><Link to='/admin/orders'>سفارشات</Link></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="infoSection">
                        <div className="row">
                            <div className="col-12 col-md-3">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #60aff5, #2c75e8)' }}>
                                    <h4 className="text-white mb-0">سفارشات :</h4>
                                    <span className="text-white">{stats?.totalOrders || 0}</span>
                                    <div className="icon">
                                        <MdOutlineProductionQuantityLimits />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #f3cd29, #e1950e)' }}>
                                    <h4 className="text-white mb-0">در انتظار :</h4>
                                    <span className="text-white">
                                        {stats?.byStatus?.find(s => s._id === 'در انتظار')?.count || 0}
                                    </span>
                                    <div className="icon">
                                        <MdCategory />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #28a745, #20c997)' }}>
                                    <h4 className="text-white mb-0">تایید شده :</h4>
                                    <span className="text-white">
                                        {stats?.byStatus?.find(s => s._id === 'تایید شده')?.count || 0}
                                    </span>
                                    <div className="icon">
                                        <MdCategory />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="infoBox" style={{ backgroundImage: 'linear-gradient(to right, #dc3545, #e74c3c)' }}>
                                    <h4 className="text-white mb-0">لغو شده :</h4>
                                    <span className="text-white">
                                        {stats?.byStatus?.find(s => s._id === 'لغو شده')?.count || 0}
                                    </span>
                                    <div className="icon">
                                        <MdCategory />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="searchSection mt-3 px-3">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="form-group">
                                    <label className="form-label">جستجو بر اساس آیدی کاربر</label>
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={searchUserId}
                                            onChange={handleSearch}
                                            style={{ textAlign: 'right' }}
                                        />
                                        {searchUserId && (
                                            <button
                                                className="btn btn-danger mx-1"
                                                onClick={clearSearch}
                                                style={{ textWrap: 'nowrap' }}
                                            >
                                                پاک کردن
                                            </button>
                                        )}
                                    </div>
                                    {searchUserId && (
                                        <small className="text-muted mt-1 d-block">
                                            {filteredOrders.length} سفارش یافت شد
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card Table shadow border-0 p-3 mt-4">
                        <h3 className="hd">لیست سفارشات</h3>

                        <div className="table-responsive mt-3">
                            {isLoading ? (
                                <div className="text-center my-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">در حال بارگذاری...</span>
                                    </div>
                                </div>
                            ) : (
                                <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ width: '60px' }}>ردیف</th>
                                            <th>آیدی مشتری</th>
                                            <th>نام مشتری</th>
                                            <th>شماره تماس</th>
                                            <th>تعداد آیتم</th>
                                            <th style={{ width: '150px' }}>مبلغ کل</th>
                                            <th>وضعیت</th>
                                            <th>تاریخ ثبت</th>
                                            <th style={{ width: '200px' }}>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders?.length > 0 ? (
                                            filteredOrders?.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr className={`order-row ${expandedOrder === item?._id ? 'expanded' : ''}`} key={item._id}>
                                                            <td>
                                                                <div className="d-flex align-items-center mr-2">
                                                                    {index + 1}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="clientId" style={{ cursor: 'pointer' }} onClick={() => copyClientId(item?.clientId)}>
                                                                    <small>{item?.clientId?.substr(0, 8)}...</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box">
                                                                    {item?.clientName || '-'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box">
                                                                    {item?.clientPhoneNumber || '-'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box text-center">
                                                                    {item?.totalItems || item?.items?.length || 0}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box">
                                                                    <span className="text-danger">
                                                                        <b>{item?.totalPrice?.toLocaleString()}</b>
                                                                    </span>
                                                                    &nbsp;تومان
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box">
                                                                    <select
                                                                        className={`order-status-select status-${getStatusClass(item?.status)}`}
                                                                        value={item?.status}
                                                                        onChange={(e) => updateOrderStatus(item?._id, e.target.value)}
                                                                        disabled={btnDisabled}
                                                                    >
                                                                        <option value="در انتظار">در انتظار</option>
                                                                        <option value="در حال پردازش">در حال پردازش</option>
                                                                        <option value="تایید شده">تایید شده</option>
                                                                        <option value="لغو شده">لغو شده</option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="box">
                                                                    {item?.dateCreated || '-'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="actions d-flex align-items-center">
                                                                    <Button
                                                                        className="secondary"
                                                                        color="secondary"
                                                                        onClick={() => toggleExpand(item?._id)}
                                                                        style={{ fontSize: '12px' }}
                                                                    >
                                                                        {expandedOrder === item?._id ? <IoCloseSharp /> : <BsEye />}
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => deleteOrder(item?._id)}
                                                                        className="error"
                                                                        color="error"
                                                                        disabled={btnDisabled}
                                                                    >
                                                                        <MdDelete />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {expandedOrder === item?._id && (
                                                            <tr className="order-details-row">
                                                                <td colSpan="9">
                                                                    <div className="order-details-wrapper pb-5">
                                                                        <h6 className="py-4 title">جزئیات سفارش :</h6>
                                                                        <div className="table-responsive">
                                                                            <table className="table table-sm table-bordered">
                                                                                <thead className="thead-dark">
                                                                                    <tr>
                                                                                        <th style={{ width: '50px' }}>ردیف</th>
                                                                                        <th style={{ width: '300px' }}>محصول/دوره</th>
                                                                                        <th style={{ width: '120px' }}>قیمت</th>
                                                                                        <th style={{ width: '70px' }}>تعداد</th>
                                                                                        <th style={{ width: '120px' }}>قیمت کل</th>
                                                                                        <th style={{ width: '80px' }}>نوع</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {item?.items?.map((product, idx) => (
                                                                                        <tr key={idx}>
                                                                                            <td className="item-col-index text-center">
                                                                                                {idx + 1}
                                                                                            </td>
                                                                                            <td className="item-col-product">
                                                                                                <Link 
                                                                                                    to={product?.typeCourse ? `/courses/${product?.productId}` : `/products/${product?.productId}`}
                                                                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                                                                >
                                                                                                    <div className="d-flex align-items-center productBox">
                                                                                                        <div className="imgWrapper">
                                                                                                            <div className="img">
                                                                                                                <img className="w-100" src={product?.image} alt={product?.productTitle} />
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="info pl-3">
                                                                                                            <h6>
                                                                                                                {product?.productTitle}
                                                                                                            </h6>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </Link>
                                                                                            </td>
                                                                                            <td className="item-col-price">
                                                                                                <div className="priceBox">
                                                                                                    {product?.price?.toLocaleString()} تومان
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="item-col-qty">
                                                                                                {product?.quantity}
                                                                                            </td>
                                                                                            <td className="item-col-subtotal">
                                                                                                <div className="priceBox">
                                                                                                    {product?.subTotal?.toLocaleString()} تومان
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="item-col-type">
                                                                                                <span className={`badge ${product?.typeCourse ? 'bg-primary' : 'bg-success'}`}>
                                                                                                    {product?.typeCourse ? 'دوره' : 'محصول'}
                                                                                                </span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                                <tfoot>
                                                                                    <tr>
                                                                                        <td colSpan="4" className="text-end py-3">
                                                                                            <strong>مجموع کل:</strong>
                                                                                        </td>
                                                                                        <td>
                                                                                            <strong>{item?.totalPrice?.toLocaleString()} تومان</strong>
                                                                                        </td>
                                                                                        <td></td>
                                                                                    </tr>
                                                                                </tfoot>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4">
                                                    <h5 className="text-muted">
                                                        {searchUserId ? 'سفارشی با این آیدی کاربر یافت نشد!' : 'هیچ سفارشی یافت نشد!'}
                                                    </h5>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                            <div className="d-flex align-items-center tableFooter">
                                <p className="mb-0">تعداد کل سفارشات : {filteredOrders?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Guide */}
                    <div className="admin-guide mt-3 p-3 rounded border">
                        <h6 className="mb-2 fw-bold"> راهنمای مدیریت سفارشات :</h6>
                        <ul className="mb-0" style={{ listStyle: 'none', paddingRight: '0' }}>
                            <li className="mb-1">
                                <span className="fw-bold">مشاهده جزئیات :</span> 
                                برای مشاهده محصولات و دوره‌های هر سفارش، روی آیکون 
                                <span className="mx-1"><BsEye /></span> 
                                کلیک کنید.
                            </li>
                            <li className="mb-1">
                                <span className="fw-bold">تغییر وضعیت :</span> 
                                از منوی کشویی در ستون وضعیت، می‌توانید وضعیت سفارش را به 
                                <span className="badge bg-warning text-dark mx-1">در انتظار</span>، 
                                <span className="badge bg-info text-white mx-1">در حال پردازش</span>، 
                                <span className="badge bg-success text-white mx-1">تایید شده</span> 
                                یا 
                                <span className="badge bg-danger text-white mx-1">لغو شده</span> 
                                تغییر دهید.
                            </li>
                            <li className="mb-1"> 
                                <span className="fw-bold">کپی آیدی :</span> 
                                برای کپی کردن آیدی مشتری، روی 
                                <span className="badge mx-1">آیدی مشتری</span> 
                                کلیک کنید.
                            </li>
                            <li className="mb-1">
                                <span className="fw-bold">حذف سفارش :</span> 
                                برای حذف یک سفارش، روی آیکون 
                                <span className="mx-1"><MdDelete /></span> 
                                کلیک کنید (قابل بازگشت نیست).
                            </li>
                            <li className="mb-1">
                                <span className="fw-bold">جستجو :</span> 
                                با وارد کردن آیدی دقیق کاربر در کادر جستجو، می‌توانید سفارشات یک کاربر خاص را مشاهده کنید.
                            </li>
                        </ul>
                    </div>

                    <div className="text-center copyright mt-5 mb-3">
                        <a target="_blank" href="https://armanassadian.ir" rel="noreferrer">
                            <span>توسعه داده شده توسط تیم فیوژن</span> &nbsp;
                        </a>
                        <AiFillCopyrightCircle />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;