import { Link, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, Checkbox, CircularProgress, ListItemText, MenuItem, Select } from "@mui/material";

import { MyContext } from "../../App";
import { useContext, useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { AiFillCopyrightCircle } from "react-icons/ai";


import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";

import { BsCalendarDate } from "react-icons/bs";
import { RiDeleteBin7Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";

const AddCourse = () => {

    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name : '',
        images: [],
        description : '',
        headline: '',
        aboutTeacher: '',
        price : null,
        oldPrice : null,
        field: '',
        startingDate: '',
        EndingDate: '',
        event: [],
        status: '',
        rating: 5,
        capacity: null,
        prerequisite: [],
    });
    
    /*const BootstrapInput = styled(InputBase)(({theme}) => ({
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
    }));*/
    // MUI

    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []);

    // selects :

    const [categoryVal, setCategoryVal] = useState('');

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);

        setFormFields(() => (
            {
                ...formFields,
                field: event.target.value
            }
        ))
    };


    const [statusVal, setStatusVal] = useState('');

    const handleChangeStatus = (event) => {
        setStatusVal(event.target.value);

        setFormFields(() => (
            {
                ...formFields,
                status: event.target.value
            }
        ))
    };


    const [eventVal, setEventVal] = useState([]);

    const handleChangeEvent = (event) => {
        const {
          target: { value },
        } = event;
        setEventVal(
          typeof value === 'string' ? value.split(',') : value,
        );
        formFields.event = value;
    };

    // to close the select menu on scroll
    
    //fields val
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

    // status val
    const [openStatusSelect, setOpenStatusSelect] = useState(false);

    const handleCloseStatus = () => {
        setOpenStatusSelect(false);
    }

    const handleOpenStatus = () => {
        setOpenStatusSelect(true);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (openStatusSelect) {
          handleCloseStatus();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [openStatusSelect]);

    //event val
    const [openEventSelect, setOpenEventSelect] = useState(false);

    const handleCloseEvent = () => {
        setOpenEventSelect(false);
    }

    const handleOpenEvent = () => {
        setOpenEventSelect(true);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (openEventSelect) {
          handleCloseEvent();
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [openEventSelect]);

    //

    // dividing 3 digits //
    /*const [value, setValue] = useState('');

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        
        const formattedValue = rawValue === '' ? '' : Number(rawValue).toLocaleString();
        
        setValue(formattedValue); 
    };*/


    //backend:

    // date pickers
    const [startingDpValue, setStartingDpValue] = useState(null);
    const [endingDpValue, setEndingDpValue] = useState(null);

    useEffect(() => {
        formFields.startingDate = startingDpValue?.format("YYYY/MM/DD");
    }, [startingDpValue])

    useEffect(() => {
        formFields.EndingDate = endingDpValue?.format("YYYY/MM/DD");
    }, [endingDpValue])

    const startPickerRef = useRef(null);
    const endPickerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (startPickerRef.current || endPickerRef.current) {
                startPickerRef.current.closeCalendar();
                endPickerRef.current.closeCalendar(); 
            }
        };
        window.addEventListener("scroll", handleScroll, true);

        // Cleanup on unmount
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    const openDp = (ref) => {
        ref.current?.openCalendar();
    };
    //

    const [eventData, setEventdata] = useState([]);
        
    useEffect(() => {
        fetchDataFromApi('/api/event').then((res) => {
            setEventdata(res);
        });
    }, []);

    const inputChange = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name] : e.target.value
            }
        ))
    }


    const [value, setValue] = useState("");
    const [array, setArray] = useState([]);

    const addPrerequisite = () => {
        const trimmed = value.trim();
        if (trimmed === "") return;

        setFormFields(prev => ({
            ...prev,
            prerequisite: [...prev.prerequisite, trimmed]
        }));

        setValue(""); 
    };

    useEffect(() => {
        setArray(formFields.prerequisite);
    }, [formFields.prerequisite]);

    const deletePrerequisite = (index) => {
        setFormFields(prev => ({
            ...prev,
            prerequisite: prev.prerequisite.filter((_, i) => i !== index)  
        }));
    };

    const formdata = new FormData();

    /* img problem ---> */
    const [uploading, setUploading] = useState(false);

    const [uploadedImages, setUploadedImages] = useState([]);   // Cloudinary URLs

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;

            if (!files || files.length === 0) {
                return;
            }

            // Show loading spinner
            setUploading(true);

            // Create a new FormData for THIS upload
            const formdata = new FormData();

            // Validate & append selected files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

                if (!validTypes.includes(file.type)) {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "فرمت فایل معتبر نیست!"
                    });

                    setUploading(false);
                    return;
                }

                formdata.append("images", file);
            }

            // Upload to backend → Cloudinary → returns URLs
            const urls = await postData("/api/product/upload", formdata);

            // urls will be something like:
            // ["https://res.cloudinary.com/.../img1.jpg", "https://.../img2.jpg"]

            if (urls && urls.length > 0) {
                // Add uploaded URLs to state
                setUploadedImages(prev => [...prev, ...urls]);
            }

            // Done
            setUploading(false);

            context.setAlertBox({
                open: true,
                error: false,
                msg: "تصاویر با موفقیت آپلود شدند!"
            });

        } catch (error) {
            console.log(error);
            setUploading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "آپلود با خطا مواجه شد!"
            });
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const history = useNavigate();

    const addCourse = (e) => {
        e.preventDefault();

        formdata.append('name', formFields.name);
        formdata.append('description', formFields.description);
        formdata.append('field', formFields.field);
        formdata.append('price', formFields.price);
        formdata.append('oldPrice', formFields.oldPrice);
        formdata.append('status', formFields.status);
        formdata.append('event', formFields.event);
        formdata.append('startingDate', formFields.startingDate);
        formdata.append('EndingDate', formFields.EndingDate);
        formdata.append('rating', formFields.rating);
        formdata.append('capacity', formFields.capacity);
        formdata.append('prerequisite', formFields.prerequisite);
        formdata.append('headline', formFields.headline);
        formdata.append('aboutTeacher', formFields.aboutTeacher);


        if(formFields.name === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "نام دوره را وارد کنید!"
            });
            return false;
        }

        if(formFields.description === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "درباره دوره را وارد کنید!"
            });
            return false;
        }

        if(formFields.field === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "حوزه دوره را انتخاب کنید!"
            });
            return false;
        }

        if(formFields.status === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "وضعیت دوره را مشخص کنید!"
            });
            return false;
        }

        if(formFields.price === null || formFields.price === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "قیمت دوره را وارد کنید!"
            });
            return false;
        }

        if(formFields.capacity === null || formFields.capacity === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "ظرفیت دوره را مشخص کنید!"
            });
            return false;
        }

        if(formFields.headline === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "سرفصل های دوره را تعریف کنید!"
            });
            return false;
        }

        if(uploadedImages.length === 0){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "عکس دوره را بارگذاری کنید!"
            });
            return false;
        }

        if(uploading === true){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "عکس در حال بارگذاری است!"
            });
            return false;
        }

        const courseData = {
            ...formFields,
            images: uploadedImages
        };

        setBtnDisabled(true);
        setIsLoading(true);

        // submitting form in the database
        postData('/api/course/create', courseData).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "دوره جدید با موفقیت اضافه شد!"

            });

            setTimeout(() => {
                setBtnDisabled(false);
            }, 1000);

            setTimeout(() => {
                setIsLoading(false);
            }, 500);

            deleteData("/api/imageUpload/deleteAllImages");

            history('/courses');

            setUploadedImages([]);
        })
        
    }

    const copyId = (id) => {
        navigator.clipboard.writeText(id);
        context.setAlertBox({
            open: true,
            error: false,
            msg: "آیدی کپی شد!"
        })
    }

    const FcRemoveImage = async (index, imgUrl) => {
        try {
            setUploadedImages(prev => prev.filter((url, i) => i !== index));

            /* 3 — Extract public_id from Cloudinary URL
            const parts = imgUrl.split("/");
            const file = parts[parts.length - 1]; // "abc123.jpg"
            const publicId = file.split(".")[0]; // "abc123"

            // 4 — Request backend to delete from Cloudinary
            await deleteData(`/api/product/delete-image/${publicId}`);

            context.setAlertBox({
                open: true,
                error: false,
                msg: "حذف شد!"
            });*/

        } catch (error) {
            console.log(error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "خطا در حذف تصویر!"
            });
        }
    };

    return (
        <>
        <div className="right-content w-100">
            <div className="addCourseSection">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">آپلود دوره</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/courses'>دوره ها</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/courses/upload'>آپلود دوره</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="form" onSubmit={addCourse}>
                <div className="card formCard shadow p-4 mt-4 mb-4">
                        <h4 className='mb-4'>آپلود دوره</h4>
                        
                    <div className="row my-4">

                        <div className="col-12 col-md-9">
                            <div className='form-group'>
                                <h6>نام دوره</h6>
                                <input name="name" value={formFields.name} onChange={inputChange} type='text' />
                            </div>
                        </div>

                         <div className="col-12 col-md-9 my-4">
                            <div className='form-group'>
                                <h6>درباره این دوره</h6>
                                <textarea name="description" value={formFields.description} onChange={inputChange} type='text' cols={2} placeholder=""></textarea>
                            </div>
                        </div>

                    </div>

                    <div className="row my-4">

                        <div className="col-12 col-md-4">
                            <div className='form-group'>
                                <h6>حوزه</h6>
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='w-100'
                                    sx={{
                                        'label + &': {
                                            //marginTop: theme.spacing(3),
                                        },
                                        '& .MuiInputBase-input': {
                                            borderRadius: 2,
                                            position: 'static',
                                            backgroundColor: context.theme === 'dark' ? '#2b3c5f' : '#fff',
                                            color: context.theme === 'light' ? '#000' : '#ced4da',
                                            fontSize: 16,
                                            padding: '17px 26px 17px 12px',
                                            outline: '0px'
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: context.theme === 'light' ? '#000' : '#ced4da'
                                        },
                                        // Target the outline element that has the blue border
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                        },
                                        // Remove blue border on focus
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                            borderWidth: '1px !important',
                                        },
                                        // Remove blue border on hover
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                        },
                                        // Remove any box shadow
                                        '&.Mui-focused': {
                                            boxShadow: 'none',
                                        },
                                    }}
                                    open={openFieldsSelect}
                                    onClose={handleCloseFields}
                                    onOpen={handleOpenFields}
                                >
                                    <MenuItem value="سلولی، مولکولی و ژنتیک" className='text-capitalize'>سلولی، مولکولی و ژنتیک</MenuItem>
                                    <MenuItem value="میکروبیولوژی" className='text-capitalize'>میکروبیولوژی</MenuItem>
                                    <MenuItem value="نانوفناوری" className='text-capitalize'>نانوفناوری</MenuItem>
                                    <MenuItem value="خدمات عمومی" className='text-capitalize'>خدمات عمومی</MenuItem>
                                    <MenuItem value="زیست پزشکی" className='text-capitalize'>زیست پزشکی</MenuItem>
                                    <MenuItem value="بالینی و مدل حیوانی" className='text-capitalize'>بالینی و مدل حیوانی / هیستولوژی</MenuItem>
                                </Select>
                            </div>           
                        </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>تاریخ شروع</h6>
                                    <span onClick={() => openDp(startPickerRef)} className="dateIcon"><BsCalendarDate /></span>
                                    <DatePicker
                                        ref={startPickerRef} 
                                        value={startingDpValue}
                                        onChange={setStartingDpValue}
                                        calendar={persian}
                                        locale={persian_fa}
                                        format="YYYY/MM/DD"
                                        calendarPosition="bottom-right"
                                        digits // Persian digits
                                        editable={false}
                                        portal
                                        className="courseDatePicker w-100"
                                        placeholder="انتخاب کنید"
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>تاریخ پایان</h6>
                                    <span onClick={() => openDp(endPickerRef)} className="dateIcon"><BsCalendarDate /></span>
                                    <DatePicker
                                        ref={endPickerRef} 
                                        value={endingDpValue}
                                        onChange={setEndingDpValue}
                                        calendar={persian}
                                        locale={persian_fa}
                                        format="YYYY/MM/DD"
                                        calendarPosition="bottom-right"
                                        digits // Persian digits
                                        editable={false}
                                        portal
                                        className="courseDatePicker w-100"
                                        placeholder="انتخاب کنید"
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="row my-4">

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>قیمت قبلی</h6>
                                    <input name="oldPrice" value={formFields.oldPrice} onChange={inputChange} type='text'
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) && // not a digit
                                            e.key !== "Backspace" &&
                                            e.key !== "Delete" &&
                                            e.key !== "ArrowLeft" &&
                                            e.key !== "ArrowRight" &&
                                            e.key !== "Tab"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>قیمت فعلی</h6>
                                    <input name="price" value={formFields.price} onChange={inputChange} type='text' /*value={value} onChange={handleChange}*/ 
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) && // not a digit
                                            e.key !== "Backspace" &&
                                            e.key !== "Delete" &&
                                            e.key !== "ArrowLeft" &&
                                            e.key !== "ArrowRight" &&
                                            e.key !== "Tab"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>وضعیت</h6>
                                    <Select
                                        value={statusVal}
                                        onChange={handleChangeStatus}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        className='w-100'
                                        sx={{
                                            'label + &': {
                                                //marginTop: theme.spacing(3),
                                            },
                                            '& .MuiInputBase-input': {
                                                borderRadius: 2,
                                                position: 'static',
                                                backgroundColor: context.theme === 'dark' ? '#2b3c5f' : '#fff',
                                                color: context.theme === 'light' ? '#000' : '#ced4da',
                                                fontSize: 16,
                                                padding: '17px 26px 17px 12px',
                                                outline: '0px'
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: context.theme === 'light' ? '#000' : '#ced4da'
                                            },
                                            // Target the outline element that has the blue border
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                            },
                                            // Remove blue border on focus
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                                borderWidth: '1px !important',
                                            },
                                            // Remove blue border on hover
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                            },
                                            // Remove any box shadow
                                            '&.Mui-focused': {
                                                boxShadow: 'none',
                                            },
                                        }}
                                        open={openStatusSelect}
                                        onClose={handleCloseStatus}
                                        onOpen={handleOpenStatus}
                                    >
                                        <MenuItem value="در حال برگزاری" className='text-capitalize'>درحال برگزاری</MenuItem>
                                        <MenuItem value="ثبت نام" className='text-capitalize'>ثبت نام</MenuItem>
                                        <MenuItem value="پایان یافته" className='text-capitalize'>پایان یافته</MenuItem>
                                        <MenuItem value="اتمام ظرفیت" className='text-capitalize'>اتمام ظرفیت</MenuItem>
                                        <MenuItem value="پیش ثبت نام" className='text-capitalize'>پیش ثبت نام</MenuItem>
                                    </Select>
                                </div>           
                            </div>

                        </div>

                        <div className="row my-4">

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>ظرفیت</h6>
                                    <input name="capacity" value={formFields.capacity} onChange={inputChange} type='text' pattern="[0-9]*" inputmode="numeric"
                                        onKeyDown={(e) => {
                                            if (
                                                !/[0-9]/.test(e.key) && // not a digit
                                                e.key !== "Backspace" &&
                                                e.key !== "Delete" &&
                                                e.key !== "ArrowLeft" &&
                                                e.key !== "ArrowRight" &&
                                                e.key !== "Tab"
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>پیشنیاز</h6>
                                    <input name="prerequisite" type='text' value={value} onChange={(e) => setValue(e.target.value)} />
                                    <Button className="addPrerequisite" onClick={addPrerequisite}>افزودن</Button>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className='form-group'>
                                    <h6>رخداد</h6>
                                    <Select
                                        value={eventVal}
                                        onChange={handleChangeEvent}
                                        multiple
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        className='w-100'
                                        //input={<BootstrapInput />}
                                        sx={{
                                                                            'label + &': {
                                                                                //marginTop: theme.spacing(3),
                                                                            },
                                                                            '& .MuiInputBase-input': {
                                                                                borderRadius: 2,
                                                                                position: 'static',
                                                                                backgroundColor: context.theme === 'dark' ? '#2b3c5f' : '#fff',
                                                                                color: context.theme === 'light' ? '#000' : '#ced4da',
                                                                                fontSize: 16,
                                                                                padding: '17px 26px 17px 12px',
                                                                                outline: '0px'
                                                                            },
                                                                            '& .MuiSvgIcon-root': {
                                                                                color: context.theme === 'light' ? '#000' : '#ced4da'
                                                                            },
                                                                            // Target the outline element that has the blue border
                                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                                                            },
                                                                            // Remove blue border on focus
                                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                                                                borderWidth: '1px !important',
                                                                            },
                                                                            // Remove blue border on hover
                                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                                border: context.theme === 'light' ? '1px solid #ced4da' : '1px solid #2b3c5f',
                                                                            },
                                                                            // Remove any box shadow
                                                                            '&.Mui-focused': {
                                                                                boxShadow: 'none',
                                                                            },
                                        }}
                                        renderValue={(selected) => selected.join(', ')}
                                        open={openEventSelect}
                                        onClose={handleCloseEvent}
                                        onOpen={handleOpenEvent}
                                    >
                                        {eventData?.length !== 0 && eventData?.length !== undefined && eventData?.map((event, index) => (
                                            <MenuItem className="text-wrap" key={index} value={event?.name}>
                                                <Checkbox checked={eventVal.includes(event?.name)} />
                                            <ListItemText primary={event?.name} />
                                          </MenuItem>
                                        ))}
                                    </Select>
                                </div>           
                            </div>

                            <div className="col-12 mt-5">
                                <div className="d-flex align-items-center flex-wrap">
                                {array?.length !== undefined && array?.length !== 0 && <h6 className="ms-3">پیش نیاز های تعیین شده :</h6>}
                                {
                                    array?.length !== undefined && array?.length !== 0 && array?.map((item, index) => {
                                        return(
                                            <span className="badge prerequisiteBox my-1 mx-1" key={index}>
                                                <Button className="ms-1" onClick={() => deletePrerequisite(index)}><RiDeleteBin7Line /></Button>
                                                <span className="inputFont" onClick={() => copyId(item)} >{item}</span>
                                            </span>
                                        )
                                    })
                                }
                                </div>
                            </div>

                        </div>

                        
                </div>

                <div className='card p-4 mt-4 mb-4 formCard'>
                    <div className="col-12 col-md-9 my-4">
                        <div className='form-group'>
                            <h6>سر فصل های این دوره</h6>
                            <textarea name="headline" value={formFields.headline} onChange={inputChange} type='text' cols={2} placeholder="" className="headline"></textarea>
                        </div>
                    </div>

                    <div className="col-12 col-md-9 my-4">
                        <div className='form-group'>
                            <h6>درباره مدرس</h6>
                            <textarea name="aboutTeacher" value={formFields.aboutTeacher} onChange={inputChange} type='text' cols={2} placeholder=""></textarea>
                        </div>
                    </div>
                </div>

                <div className='card p-4 mt-0 formCard'>
                    <div className='imagesUploadSec'>
                        <h5 className='mb-4'>آپلود تصویر</h5>
                        <div className='imgUploadBox d-flex align-items-center'>
                            
                            {uploadedImages?.length !== 0 &&
                                uploadedImages.map((img, index) => (
                                    <div className='uploadBox' key={index}>
                                        <span className="remove" onClick={() => FcRemoveImage(index, img)}>
                                            <IoCloseSharp />
                                        </span>
                                
                                        <img src={img} className='w-100' />
                                    </div>
                                ))
                            }

                            <div className='uploadBox'>
                                {
                                    uploading === true ?
                                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                        <CircularProgress />
                                        <span>در حال بارگذاری</span>
                                    </div>
                                    :
                                    <>
                                    <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/product/upload')} name='images' disabled={uploading} />
                                    <div className='info'>
                                        <FaRegImages />
                                        <h5 className="mt-1">آپلود تصویر</h5>
                                    </div>
                                    </>
                                }
                            </div>
                        </div>
    
                        <br />
                    </div>
 
                    <Button className={`w-100 text-nowrap ${btnDisabled !== false && 'btnDisabled'}`} type="submit">
                        <FaCloudUploadAlt /> &nbsp; انتشار و مشاهده دوره
                        {
                            isLoading === true && 
                            <CircularProgress
                                sx={() => ({
                                    color: context.theme === 'dark' ? '#1a0b66ff !important' : '#000',
                                    marginRight: '15px',
                                })}
                                enableTrackSlot size="25px" 
                            />
                        }
                    </Button>

                    
                </div>
            </form>

                <div className="text-center copyright mt-5 mb-3">
                    <a target="_blank" href="https://armanassadian.ir">
                        <span>توسعه داده شده توسط تیم فیوژن</span> &nbsp;
                    </a>
                    <AiFillCopyrightCircle />
                </div>

            </div>
        </div>
        </>
    );
}
 
export default AddCourse;