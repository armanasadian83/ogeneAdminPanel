import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

import { FaEye, FaPencilAlt, FaUserCircle, FaSms } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { 
    Button, 
    MenuItem, 
    Select, 
    FormControl 
} from "@mui/material";
import Rating from '@mui/material/Rating';
import { AiFillCopyrightCircle } from "react-icons/ai";
import { LuRefreshCcw } from "react-icons/lu";

import { MdCategory } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

import { PiSealCheckBold } from "react-icons/pi";
import { PiSealWarningLight } from "react-icons/pi";
import { TbReload } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { GrDocumentDownload } from "react-icons/gr";
import { RiUserSearchLine } from "react-icons/ri";

// Import the Bale Logo from your assets folder
import baleLogo from "../../assets/baleLogo.svg"; 

// Import xlsx for Excel generation
import * as XLSX from 'xlsx';


const UserList = () => {

    const context = useContext(MyContext);

    const BootstrapInput = styled(InputBase)(({theme}) => ({
        'label + &': {
            marginTop: theme.spacing(3),
        },
        '& .MuiInputBase-input': {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: context.theme === 'dark' ? '#2b3c5f' : '#fff',
            color: context.theme === 'light' ? '#000' : '#ced4da',
            border: context.theme === 'light' ? '1px solid #ced4da' : '',
            fontSize: 16,
            padding: '17px 26px 17px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
        },
        '& .MuiSvgIcon-root': {
            color: context.theme === 'light' ? '#000' : '#ced4da'
        }
    }));
        
    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []);

    const [categoryVal, setCategoryVal] = useState("سلولی، مولکولی و ژنتیک");

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
    };

    // to close the select menu on scroll
    const [openFieldsSelect, setOpenFieldsSelect] = useState(false);

    const handleCloseFields = () => {
        setOpenFieldsSelect(false);
    }

    const handleOpenFields = () => {
        setOpenFieldsSelect(true);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (openFieldsSelect) {
          handleCloseFields();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [openFieldsSelect]);

    // ============================================
    // SEARCH STATE
    // ============================================
    const [searchName, setSearchName] = useState("");
    const [searchUserId, setSearchUserId] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    // ============================================
    // TOOLBAR & MODAL STATE
    // ============================================
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
    const [smsMessage, setSmsMessage] = useState("");
    const [smsTarget, setSmsTarget] = useState("all"); // 'all' or 'single'
    const [singleUserId, setSingleUserId] = useState("");

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    const toEnglishDigits = (str) => {
        if (!str) return '';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let result = str;
        persianDigits.forEach((p, i) => {
            result = result.replace(new RegExp(p, 'g'), englishDigits[i]);
        });
        return result;
    };

    // Normalize text for search (handles Persian/Arabic characters)
    const normalizeText = (str) => {
        if (!str) return '';
        // Convert Persian/Arabic characters to their English equivalents
        const charMap = {
            'ا': 'ا', 'آ': 'ا', 'أ': 'ا', 'إ': 'ا',
            'ب': 'ب', 'پ': 'پ',
            'ت': 'ت', 'ث': 'ث',
            'ج': 'ج', 'چ': 'چ',
            'ح': 'ح', 'خ': 'خ',
            'د': 'د', 'ذ': 'ذ',
            'ر': 'ر', 'ز': 'ز', 'ژ': 'ژ',
            'س': 'س', 'ش': 'ش',
            'ص': 'ص', 'ض': 'ض',
            'ط': 'ط', 'ظ': 'ظ',
            'ع': 'ع', 'غ': 'غ',
            'ف': 'ف', 'ق': 'ق',
            'ک': 'ک', 'گ': 'گ',
            'ل': 'ل', 'م': 'م',
            'ن': 'ن', 'و': 'و',
            'ه': 'ه', 'ی': 'ی', 'ي': 'ی'
        };
        let result = str;
        Object.keys(charMap).forEach(key => {
            result = result.replace(new RegExp(key, 'g'), charMap[key]);
        });
        return result.toLowerCase();
    };

    // ============================================
    // BACKEND STATE
    // ============================================
    const [clientData, setClientData] = useState([]);
    const [adminData, setAdminData] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const fetchAllData = () => {
        context.setProgress(30);
        fetchDataFromApi('/api/client').then((res) => {
            setClientData(res);
            context.setProgress(100);
        });

        fetchDataFromApi('/api/user').then((res) => {
            setAdminData(res);
            context.setProgress(100);
        });
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // ============================================
    // FILTERED CLIENTS
    // ============================================
    const filteredClients = clientData?.filter(client => {
        // Normalize all search terms
        const searchNameNormalized = normalizeText(searchName);
        const searchIdNormalized = toEnglishDigits(searchUserId || '').toLowerCase();
        const searchPhoneNormalized = toEnglishDigits(searchPhone || '');

        // Normalize client data
        const clientFullName = normalizeText(`${client?.name || ''} ${client?.lastName || ''}`.trim());
        const clientName = normalizeText(client?.name || '');
        const clientLastName = normalizeText(client?.lastName || '');
        const clientId = (client?.id || '').toLowerCase();
        const clientPhone = toEnglishDigits(client?.phone || '');

        // Check matches
        const matchName = searchNameNormalized ? 
            clientFullName.includes(searchNameNormalized) || 
            clientName.includes(searchNameNormalized) || 
            clientLastName.includes(searchNameNormalized) : true;

        const matchUserId = searchIdNormalized ? clientId.includes(searchIdNormalized) : true;
        const matchPhone = searchPhoneNormalized ? clientPhone.includes(searchPhoneNormalized) : true;

        return matchName && matchUserId && matchPhone;
    });

    // ============================================
    // FUNCTIONS
    // ============================================
    const deleteClient = (id) => {
        context.setProgress(30);
        setBtnDisabled(true);

        deleteData(`/api/client/${id}`).then((res) => {
            fetchDataFromApi('/api/client').then((res) => {
                setClientData(res);
                context.setProgress(100);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            });
        })
    }

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

    // Force re-verify function with browser confirm
    const forceReverify = (client) => {
        if (window.confirm(
            `⚠️ هشدار!\n\nاین اقدام باعث می‌شود تا کاربر "${client?.name} ${client?.lastName || ''}" مجبور شود مجدداً شماره تلفن خود را تایید کند.\n\nآیا مطمئن هستید؟`
        )) {
            context.setProgress(30);
            setBtnDisabled(true);

            // Use the dedicated force-reverify route
            editData(`/api/client/force-reverify/${client._id}`, {}).then((res) => {
                console.log("✅ Response:", res);
                
                // Refresh the user list
                fetchDataFromApi('/api/client').then((res) => {
                    setClientData(res);
                    context.setProgress(100);
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: `وضعیت کاربر "${client?.name} ${client?.lastName || ''}" با موفقیت به‌روزرسانی شد. کاربر در ورود بعدی مجبور به تایید شماره تلفن خواهد شد.`
                    });
                    setTimeout(() => {
                        setBtnDisabled(false);
                    }, 1000);
                });
            }).catch((err) => {
                console.error("❌ Error:", err);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در بروزرسانی وضعیت کاربر! لطفاً دوباره تلاش کنید.'
                });
                setBtnDisabled(false);
            });
        }
    };

    // NEW: Verify user's phone manually (sets isVerified to true)
    const verifyUserPhone = (client) => {
        if (window.confirm(
            `تایید شماره تلفن کاربر\n\nآیا مطمئن هستید که می‌خواهید شماره تلفن کاربر "${client?.name} ${client?.lastName || ''}" را به صورت دستی تایید کنید؟\n\nشماره تلفن: ${client?.phone}`
        )) {
            context.setProgress(30);
            setBtnDisabled(true);

            editData(`/api/client/verify-phone/${client._id}`, {}).then((res) => {
                console.log("✅ Response:", res);
                
                fetchDataFromApi('/api/client').then((res) => {
                    setClientData(res);
                    context.setProgress(100);
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: `شماره تلفن کاربر "${client?.name} ${client?.lastName || ''}" با موفقیت تایید شد!`
                    });
                    setTimeout(() => {
                        setBtnDisabled(false);
                    }, 1000);
                });
            }).catch((err) => {
                console.error("❌ Error:", err);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'خطا در تایید شماره تلفن کاربر! لطفاً دوباره تلاش کنید.'
                });
                setBtnDisabled(false);
            });
        }
    };

    // --- Toolbar handlers ---
    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchAllData();
        setTimeout(() => {
            setIsRefreshing(false);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'جدول با موفقیت بروزرسانی شد!'
            });
        }, 1000);
    };

    const handleSmsSend = () => {
        if (!smsMessage.trim()) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفاً متن پیامک را وارد کنید.'
            });
            return;
        }
        if (smsTarget === "single" && !singleUserId.trim()) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'لطفاً شناسه کاربر را وارد کنید.'
            });
            return;
        }

        console.log("Sending SMS:", { message: smsMessage, target: smsTarget, userId: singleUserId });
        
        /*context.setAlertBox({
            open: true,
            error: false,
            msg: 'پیامک با موفقیت ارسال شد!'
        });*/
        window.alert("امکان ارسال پیامک به زودی میسر خواهد شد.")
        setIsSmsModalOpen(false);
        setSmsMessage("");
        setSingleUserId("");
    };

    const handleBaleClick = () => {
        alert("امکان ارسال پیام به کاربران در اپلیکیشن بله به زودی میسر خواهد شد.");
    };

    // --- NEW: Excel Export Function ---
    const handleDownloadExcel = () => {
        if (!clientData || clientData.length === 0) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'داده‌ای برای خروجی وجود ندارد!'
            });
            return;
        }

        // 1. Prepare the data for Excel
        const excelData = clientData.map((client, index) => ({
            'ردیف': index + 1,
            'آیدی': client?.id || '',
            'نام و نام خانوادگی': `${client?.name || ''} ${client?.lastName || ''}`.trim(),
            'ایمیل': client?.email || '-',
            'شماره تلفن': client?.phone || '',
            'وضعیت تایید': client?.isVerified === true ? 'تایید شده' : 'تایید نشده',
            'زمان ساخت': client?.dateCreated || '',
            'آخرین ویرایش': client?.dateEdited || '-'
        }));

        // 2. Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        // 3. Generate and download the file
        XLSX.writeFile(workbook, "Users_List.xlsx");

        context.setAlertBox({
            open: true,
            error: false,
            msg: 'فایل خروجی با موفقیت دانلود شد!'
        });
    };

    // Search handlers
    const handleSearchName = (e) => {
        setSearchName(e.target.value);
    };

    const handleSearchUserId = (e) => {
        setSearchUserId(e.target.value);
    };

    const handleSearchPhone = (e) => {
        setSearchPhone(e.target.value);
    };

    const clearSearchName = () => {
        setSearchName("");
    };

    const clearSearchUserId = () => {
        setSearchUserId("");
    };

    const clearSearchPhone = () => {
        setSearchPhone("");
    };

    const clearAllSearches = () => {
        setSearchName("");
        setSearchUserId("");
        setSearchPhone("");
    };

    return (
        <>
        <div className="right-content w-100">
            <div className="SectionPage">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">لیست کاربران</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/service'>مدیریت کاربران</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">کاربران :</h4>
                                <span className="text-white">{clientData?.length}</span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">ادمین ها :</h4>
                                <span className="text-white">{adminData?.length}</span>
                                <div className="icon">
                                    <MdCategory  />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #f7971e, #ffd200)'}}>
                                <h4 className="text-white mb-0">نتایج جستجو :</h4>
                                <span className="text-white">{filteredClients?.length}</span>
                                <div className="icon">
                                    <FaEye />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================================================================== */}
                {/* TOOLBAR SECTION (Now with Excel Download Button) */}
                {/* ===================================================================== */}
                <div className="searchSection mt-3 px-3">
                    <div className="toolbar-container px-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h6 className="mb-0 d-none d-sm-block" style={{ marginLeft: '10px' }}>نوار ابزار</h6>
                            
                            {/* 1. Refresh Button */}
                            <button onClick={handleRefresh} title="بروزرسانی" className="toolbar-btn">
                                <div className="toolbar-btn-icon">
                                    <LuRefreshCcw size={22} className={isRefreshing ? "spin" : ""} />
                                </div>
                            </button>

                            {/* 2. SMS Button */}
                            <button onClick={() => setIsSmsModalOpen(true)} title="ارسال پیامک" className="toolbar-btn">
                                <div className="toolbar-btn-icon">
                                    <FaSms size={22} />
                                </div>
                            </button>

                            {/* 3. Bale Logo Button */}
                            <button onClick={handleBaleClick} title="ارسال پیام در بله" className="toolbar-btn">
                                <div className="toolbar-btn-icon">
                                    <img src={baleLogo} alt="Bale" style={{ width: '20px', height: 'auto' }} />
                                </div>
                            </button>

                            {/* 2. Download excelFile button for mobile */}
                            <button onClick={handleDownloadExcel}  className="toolbar-btn d-block d-sm-none">
                                <div className="toolbar-btn-icon">
                                    <GrDocumentDownload size={20} />
                                </div>
                            </button>
                        </div>

                        {/* 4. Excel Export Button (flex end) */}
                        <button 
                            onClick={handleDownloadExcel} 
                            className="downloadExcelBtn d-none d-sm-block"
                        >
                            دریافت خروجی
                        </button>
                    </div>
                </div>
                {/* ===================================================================== */}

                {/* Search Section - 3 columns */}
                <div className="searchSection mt-3 px-3">
                    <div className="row">

                        {/* Search by User ID */}
                        <div className="col-12 col-md-4">
                            <div className="form-group space-y-mobile">
                                <label className="form-label"><RiUserSearchLine size={18} className="me-1" /> &nbsp;
                                جستجو بر اساس آیدی کاربر</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchUserId}
                                        onChange={handleSearchUserId}
                                        style={{ textAlign: 'right' }}
                                    />
                                    {searchUserId && (
                                        <button
                                            className="btn btn-danger mx-1"
                                            onClick={clearSearchUserId}
                                            style={{ textWrap: 'nowrap' }}
                                        >
                                            پاک کردن
                                        </button>
                                    )}
                                </div>
                                {searchUserId && (
                                    <small className="text-muted mt-1 d-block">
                                        {filteredClients?.length} کاربر یافت شد
                                    </small>
                                )}
                            </div>
                        </div>

                        {/* Search by Phone */}
                        <div className="col-12 col-md-4">
                            <div className="form-group space-y-mobile">
                                <label className="form-label"><RiUserSearchLine size={18} className="me-1" /> &nbsp;
                                    جستجو بر اساس شماره تلفن</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchPhone}
                                        onChange={handleSearchPhone}
                                        style={{ textAlign: 'right' }}
                                    />
                                    {searchPhone && (
                                        <button
                                            className="btn btn-danger mx-1"
                                            onClick={clearSearchPhone}
                                            style={{ textWrap: 'nowrap' }}
                                        >
                                            پاک کردن
                                        </button>
                                    )}
                                </div>
                                {searchPhone && (
                                    <small className="text-muted mt-1 d-block">
                                        {filteredClients?.length} کاربر یافت شد
                                    </small>
                                )}
                            </div>
                        </div>

                        {/* Search by Name */}
                        <div className="col-12 col-md-4">
                            <div className="form-group space-y-mobile">
                                <label className="form-label"><RiUserSearchLine size={18} className="me-1" /> &nbsp;
                                    جستجو بر اساس نام</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={searchName}
                                        onChange={handleSearchName}
                                        style={{ textAlign: 'right' }}
                                    />
                                    {searchName && (
                                        <button
                                            className="btn btn-danger mx-1"
                                            onClick={clearSearchName}
                                            style={{ textWrap: 'nowrap' }}
                                        >
                                            پاک کردن
                                        </button>
                                    )}
                                </div>
                                {searchName && (
                                    <small className="text-muted mt-1 d-block">
                                        {filteredClients?.length} کاربر یافت شد
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card Table shadow border-0 p-3 mt-3">
                    <h3 className="hd">لیست کاربران</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th>آیدی</th>
                                    <th style={{width : '300px'}}>اطلاعات کاربر</th>
                                    <th>ایمیل</th>
                                    <th>شماره تلفن</th>
                                    <th>وضعیت تایید</th>
                                    <th>زمان ساخت اکانت</th>
                                    <th>آخرین ویرایش</th>
                                    <th>تایید شماره</th>
                                    <th>اجبار به تایید</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    filteredClients?.length !== undefined && filteredClients?.length !== 0 && filteredClients?.map((client, index) => {
                                       return(
                                           <tr key={index}>
                                               <td>
                                                   <div className="d-flex align-items-center mr-2">
                                                       {index + 1}
                                                   </div>
                                               </td>
                                               <td>
                                                    <div className="clientId" style={{ cursor: 'pointer' }} onClick={() => copyClientId(client?.id)}>
                                                        <small>{client?.id?.substr(0, 8)}...</small>
                                                    </div>
                                                </td>
                                               <td>
                                                   <div className="userBox">
                                                       {client?.name}&nbsp;{client?.lastName}
                                                   </div>
                                               </td>
                                               <td>
                                                   <div className="userBox inputFont">
                                                       {client?.email || '-'}
                                                   </div>
                                               </td>
                                               <td>
                                                   <div className="box">
                                                       {client?.phone}
                                                   </div>
                                               </td>
                                               <td>
                                                   <div className="box text-center">
                                                       {client?.isVerified === true ? 
                                                        <PiSealCheckBold style={{fontSize: '30px', color: 'green'}} title="تایید شده" /> 
                                                        : <PiSealWarningLight style={{fontSize: '30px', color: 'red'}} title="تایید نشده" />}
                                                   </div>
                                               </td>
                                               <td>
                                                   <div className="box">
                                                       {client?.dateCreated}
                                                   </div>
                                               </td>
                                               <td>
                                                   <div className="box text-center">
                                                       {client?.dateEdited ? client?.dateEdited : <b>-</b>}
                                                   </div>
                                               </td>
                                               <td> 
                                                   <div className="box d-flex align-items-center justify-content-center">
                                                        <Button 
                                                            onClick={() => verifyUserPhone(client)}
                                                            className={`verify-btn ${client?.isVerified === true ? 'verified' : ''} ${btnDisabled !== false && 'btnDisabled'}`}
                                                            disabled={btnDisabled || client?.isVerified === true}
                                                            title={client?.isVerified === true ? "شماره تلفن قبلاً تایید شده است" : "تایید شماره تلفن"}
                                                        >
                                                            <FaCheck style={{ fontSize: '12px' }} />
                                                            {client?.isVerified === true ? 'تایید شده' : 'تایید شماره'}
                                                        </Button>
                                                   </div>
                                               </td>
                                               <td> 
                                                   <div className="box d-flex align-items-center justify-content-center">
                                                        <Button 
                                                            onClick={() => forceReverify(client)}
                                                            className={`reverify-btn ${btnDisabled !== false && 'btnDisabled'}`}
                                                            disabled={btnDisabled}
                                                            title="مجبور به تایید مجدد"
                                                        >
                                                            <TbReload style={{ fontSize: '14px' }} />
                                                            تایید مجدد
                                                        </Button>
                                                   </div>
                                               </td>
                                               <td> 
                                                   <div className="actions d-flex align-items-center">
                                                        <Link to={`${btnDisabled !== true ? `/userList/edit/${client?.id}` : '/products'} `}>
                                                            <Button className={`success ${btnDisabled !== false && 'btnDisabled'}`} color='success' ><FaPencilAlt /></Button>
                                                        </Link>
                                                        <Button onClick={() => deleteClient(client?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
                                                   </div>
                                               </td>
                                           </tr>            
                                       )
                                    })
                                }                                
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل کاربران :
                                {clientData?.length}
                            </p>
                            {(searchName || searchUserId || searchPhone) && (
                                <p className="mb-0 mx-3">
                                    نتایج جستجو: {filteredClients?.length}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center copyright mt-5 mb-3">
                    <a target="_blank" href="https://armanassadian.ir">
                        <span>توسعه داده شده توسط تیم فیوژن</span> &nbsp;
                    </a>
                    <AiFillCopyrightCircle />
                </div>

            </div>
        </div>

        {/* ===================================================================== */}
        {/* SMS MODAL */}
        {/* ===================================================================== */}
        {isSmsModalOpen && (
            <div 
                className="sms-modal-overlay" 
                onClick={() => setIsSmsModalOpen(false)}
            >
                <div 
                    className="sms-modal-box" 
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Title */}
                    <h3 className="sms-modal-title">ارسال پیامک به کاربران</h3>
                    
                    {/* Text Area */}
                    <textarea
                        className="sms-modal-textarea"
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        placeholder="متن پیامک خود را وارد کنید..."
                    />

                    {/* Custom Pill Toggle Switch */}
                    <div className="pill-toggle-container">
                        <label className="pill-toggle-wrapper">
                            <input 
                                type="checkbox" 
                                className="pill-toggle-input"
                                checked={smsTarget === "single"}
                                onChange={(e) => setSmsTarget(e.target.checked ? "single" : "all")}
                            />
                            <span className="pill-toggle-slider"></span>
                            <div className="pill-toggle-labels">
                                {/* LABELS ARE SWAPPED IN HTML TO MATCH THE CSS FLEX-REVERSE */}
                                <span className="pill-toggle-label active">یک کاربر خاص</span>
                                <span className="pill-toggle-label inactive">همه کاربران</span>
                            </div>
                        </label>
                    </div>

                    {/* Conditional ID Input (Only shows when toggle is on "یک کاربر خاص") */}
                    {smsTarget === "single" && (
                        <div className="sms-modal-input-row">
                            <label className="sms-modal-label">شناسه کاربر:</label>
                            <input
                                className="sms-modal-input"
                                type="text"
                                value={singleUserId}
                                onChange={(e) => setSingleUserId(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="sms-modal-footer">
                        <button className="sms-btn-secondary" onClick={() => setIsSmsModalOpen(false)}>
                            انصراف
                        </button>
                        <button className="sms-btn-primary" onClick={handleSmsSend}>
                            ارسال
                        </button>
                    </div>

                </div>
            </div>
        )}
        </>
    );
}
 
export default UserList;