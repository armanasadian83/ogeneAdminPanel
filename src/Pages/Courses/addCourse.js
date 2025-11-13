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
import { fetchDataFromApi, postData } from "../../utils/api";

import { BsCalendarDate } from "react-icons/bs";
import { RiDeleteBin7Line } from "react-icons/ri";

const AddCourse = () => {

    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name : '',
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
    const [files, setFiles] = useState([]);
    const [imgFiles, setimgFiles] = useState();
    const [previews, setPreviews] = useState();
    
    const [imgAssigned, setImgAssigned] = useState(false);

    const onChangeFile = async(e, apiEndPoint) => {
        try {
            const imgArr = [];
            const files = e.target.files;
            //const fd = new formData();
            for(var i = 0; i < files.length; i++){
                if(files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/webp' || files[i].type === 'image/png')){
                    setimgFiles(e.target.files);

                    const file = files[i];
                    imgArr.push(file);
                    formdata.append(`images`, file); 
                }
                else{
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "فایل انتخابی باید در فرمت درست باشد!"
                    })
                    return;
                }
            }

            setFiles(imgArr);
            //console.log(imgArr);
            
            postData(apiEndPoint, formdata).then((res) => {
                //console.log(res);
                setImgAssigned(true);
            });
        }
        catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if(!imgFiles) return;
        let tmp = [];
        for(let i = 0; i<imgFiles.length; i++){
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }

        const objectUrls = tmp;
        setPreviews(objectUrls);

        //free memory
        for(let i = 0 ; i < objectUrls.length ; i++){
            return() => {
                URL.revokeObjectURL(objectUrls[i])
            }
        }
    }, [imgFiles])

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

        if(imgAssigned === false){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "عکس دوره را بارگذاری کنید!"
            });
            return false;
        }

        setBtnDisabled(true);
        setIsLoading(true);

        // submitting form in the database
        postData('/api/course/create', formFields).then((res) => {
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

            history('/courses');
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
                            
                            {
                                previews?.length !== 0 && previews?.map((img, index) => {
                                    return (
                                        <div className='uploadBox' key={index}>
                                            <img src={img} className='w-100' />
                                        </div>
                                    )
                                })
                            }

                            <div className='uploadBox'>
                                <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/course/upload')} name='images' />
                                <div className='info'>
                                    <FaRegImages />
                                    <h5 className="mt-1">آپلود تصویر</h5>
                                </div>
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