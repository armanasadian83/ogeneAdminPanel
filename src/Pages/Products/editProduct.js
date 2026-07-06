import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, Checkbox, CircularProgress, ListItemText, MenuItem, Select } from "@mui/material";

import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";

import { CiEraser } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

// adding markdown
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TbTemplate } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";

const EditProduct = () => {

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
    // MUI

    useEffect(() => {
        context.setBlurSideNavBar(true); 
    }, []);

    const [formFields, setFormFields] = useState({
            name : '',
            images: [],
            description : '',
            price : null,
            oldPrice : null,
            field: '',
            countInStock : null,
            event: [],
            rating: null,
            authorName: '',
            authorDescription: ''
        });

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


    const [statusVal, setStatusVal] = useState("فعال");

    const handleChangeStatus = (event) => {
        setStatusVal(event.target.value);
    };


    const [eventVal, setEventVal] = useState([]);

    const handleChangeEvent = (event) => {
        if(event !== ''){
                const {
              target: { value },
            } = event;
            setEventVal(
              typeof value === 'string' ? value.split(',') : value,
            );
            formFields.event = value;
        }
        else{
            formFields.event = [];
        }
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

    // adding markdown
    const [showPreview, setShowPreview] = useState(false);
    const [showAuthorPreview, setShowAuthorPreview] = useState(false);

    const convertFarsiToEnglish = (str) => {
        const map = {
          '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
          '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
        };
        return str.replace(/[۰-۹]/g, (match) => map[match]);
    };



    //backend
    const [eventData, setEventdata] = useState([]);
    const {id} = useParams();

    // img backend problems
    const [uploadedImages, setUploadedImages] = useState([]);   // Cloudinary URLs
    
    useEffect(() => {
        context.setProgress(30);

        fetchDataFromApi('/api/event').then((res) => {
            setEventdata(res);
        });


        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setFormFields({
                name: res.name,
                description: res.description,
                images: res.images,
                field: res.field,
                price: res.price,
                oldPrice: res.oldPrice,
                event: res.event,
                countInStock: res.countInStock,
                rating: res.rating,
                authorName: res.authorName,
                authorDescription: res.authorDescription
            });

            setEventVal(res.event);
            setCategoryVal(res.field);

            // img backend problem
            setUploadedImages(res.images);
        })

        context.setProgress(100);
    }, []);

    const inputChange = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name] : e.target.value
            }
        ))
    }
    const formdata = new FormData();

    const [uploading, setUploading] = useState(false);

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            const files = e.target.files;

            if (!files || files.length === 0) {
                return;
            }

            setUploading(true);

            const formdata = new FormData();

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

            // آپلود به backend (حالا ArvanCloud)
            const urls = await postData("/api/product/upload", formdata);

            if (urls && urls.length > 0) {
                setUploadedImages(prev => [...prev, ...urls]);
            }

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
    const history = useNavigate();

    const editProduct = (e) => {
            e.preventDefault();
    
            formdata.append('name', formFields.name);
            formdata.append('description', formFields.description);
            formdata.append('field', formFields.field);
            formdata.append('price', formFields.price);
            formdata.append('oldPrice', formFields.oldPrice);
            formdata.append('countInStock', formFields.countInStock);
            formdata.append('event', formFields.event);
            formdata.append('rating', formFields.rating);
            formdata.append('authorName', formFields.authorName);
            formdata.append('authorDescription', formFields.authorDescription);
    
    
            if(formFields.name === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "نام محصول را وارد کنید!"
                });
                return false;
            }
    
            if(formFields.description === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "درباره محصول را وارد کنید!"
                });
                return false;
            }
    
            if(formFields.field === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "حوزه محصول را انتخاب کنید!"
                });
                return false;
            }
    
            if(formFields.price === null || formFields.price === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "قیمت محصول را وارد کنید!"
                });
                return false;
            }
    
            if(formFields.countInStock === null || formFields.countInStock === ""){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "موجودی محصول در انبار را وارد کنید!"
                });
                return false;
            }

            if(uploadedImages.length === 0){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "عکس محصول را بارگذاری کنید!"
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

            const productData = {
                ...formFields,
                images: uploadedImages 
            };
    
            setIsLoading(true);



    
            // submitting form in the database
            editData(`/api/product/${id}`, productData).then((res) => {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "محصول با موفقیت ویرایش شد!"
    
                });
    
                setIsLoading(false);

                setFormFields({
                    name : '',
                    description : '',
                    price : null,
                    oldPrice : null,
                    field: '',
                    countInStock : null,
                    event: [],
                    authorName: '',
                    authorDescription: ''
                });


                deleteData("/api/imageUpload/deleteAllImages");
    
                history('/products');

                setUploadedImages([]);
            })
        
        }

        const clearEventVal = () => {
            setEventVal([]);
            handleChangeEvent('');
        }

        const FcRemoveImage = async (index, imgUrl) => {
            try {
                // استخراج fileKey از URL ArvanCloud
                const urlObj = new URL(imgUrl);
                const fileKey = urlObj.pathname.substring(1); // "products/123456_image.jpg"
                
                // درخواست حذف به backend
                await deleteData(`/api/product/delete-image/${encodeURIComponent(fileKey)}`);
                
                // حذف از state (UI)
                setUploadedImages(prev => prev.filter((_, i) => i !== index));
                
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "تصویر با موفقیت حذف شد!"
                });
                
            } catch (error) {
                console.log(error);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "خطا در حذف تصویر!"
                });
            }
        };

    const downloadGuide = (e) => {
        e.preventDefault();
        window.open('/markdownGuide.pdf', '_blank');
    };


    return (
        <>
        <div className="right-content w-100">
            <div className="addProductSection">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">ویرایش محصول</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/products'>محصول</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span>ویرایش محصول</span>
                            </div>
                        </div>
                    </div>
                </div>


                <form className="form" onSubmit={editProduct}>
                <div className="card formCard shadow p-4 mt-4 mb-4">
                        <h4 className='mb-4'>اطلاعات محصول</h4>
                        
                    <div className="row my-4">

                        <div className="col-12 col-md-9">
                            <div className='form-group'>
                                <h6>نام محصول</h6>
                                <input name="name" onChange={inputChange} value={formFields.name} type='text' />
                            </div>
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-12 col-md-9">
                            <div className='form-group'>
                                <h6>درباره این محصول</h6>
                                {!showPreview ? (
                                    <textarea 
                                        name="description" 
                                        onChange={inputChange} 
                                        value={formFields.description} 
                                        type='text' 
                                        cols={2} 
                                        placeholder=""
                                        style={{ minHeight: '150px', width: '100%' }}
                                    />
                                ) : (
                                    <div className="txtareaViewer">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                img: ({node, ...props}) => (
                                                    <img 
                                                        {...props} 
                                                        style={{ 
                                                            width: '100px', 
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }} 
                                                    />
                                                )
                                            }}
                                        >
                                            {formFields.description || ''}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                <div className="flex align-items-center">
                                    <button 
                                        className="changeTxtareaView mx-1"
                                        type="button" 
                                        onClick={() => setShowPreview(!showPreview)}
                                    >
                                    {showPreview ? <span><FaRegEdit />&nbsp;ویرایش محتوا</span> : <span><TbTemplate />&nbsp;پیش نمایش</span>}
                                    </button>
                                    <button className="markdownGuide changeTxtareaView mx-1"onClick={downloadGuide}>
                                        دانلود راهنما   
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row my-4">

                        <div className="col-12 col-md-4">
                            <div className='form-group'>
                                <h6>حوزه</h6> 
                                <Select
                                    value={categoryVal}
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
                                    onChange={handleChangeCategory}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className='w-100'
                                    //input={<BootstrapInput />}
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
                                <h6>قیمت قبلی</h6>
                                <input 
                                    name="oldPrice" 
                                    onChange={(e) => {
                                      const convertedValue = convertFarsiToEnglish(e.target.value);
                                      inputChange({
                                        target: {
                                          name: e.target.name,
                                          value: convertedValue
                                        }
                                      });
                                    }}
                                    value={formFields.oldPrice} 
                                    type='text' 
                                    onKeyDown={(e) => {
                                      if (/[\u06F0-\u06F9]/.test(e.key)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      if (
                                        !/[0-9]/.test(e.key) &&
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
                                <input 
                                    name="price" 
                                    onChange={(e) => {
                                      const convertedValue = convertFarsiToEnglish(e.target.value);
                                      inputChange({
                                        target: {
                                          name: e.target.name,
                                          value: convertedValue
                                        }
                                      });
                                    }}
                                    value={formFields.price} 
                                    type='text' 
                                    onKeyDown={(e) => {
                                      if (/[\u06F0-\u06F9]/.test(e.key)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      if (
                                        !/[0-9]/.test(e.key) &&
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

                    </div>

                    <div className="row my-4">

                        <div className="col-12 col-md-6">
                            <div className='form-group'>
                                <h6>انبار</h6>
                                <input name="countInStock" onChange={inputChange} value={formFields.countInStock} type='text' 
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

                        <div className="col-12 col-md-6">
                            <div className='form-group'>
                                <div className="d-flex align-items-center">
                                    <h6>رخداد</h6>
                                    <span className="me-3 eventEraser" onClick={clearEventVal}><CiEraser /></span>
                                </div>
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
                    </div>
                        
            </div>

                <div className="card formCard shadow p-4 mt-4 mb-4">
                    <h4 className='mb-4'>اطلاعات نویسنده</h4>

                    <div className="row my-4">
                        <div className="col-12 col-md-9">
                            <div className='form-group'>
                                <h6>نام نویسنده</h6>
                                <input name="authorName" onChange={inputChange} value={formFields.authorName} type='text' />
                            </div>
                        </div>
                    </div>

                    <div className="row my-4">
                        <div className="col-12 col-md-9">
                            <div className='form-group'>
                                <h6>درباره نویسنده</h6>
                                {!showAuthorPreview ? (
                                    <textarea  
                                        name="authorDescription" 
                                        onChange={inputChange} 
                                        value={formFields.authorDescription} 
                                        cols={20}
                                        placeholder=""
                                        style={{ minHeight: '150px', width: '100%' }}
                                    />
                                ) : (
                                    <div className="txtareaViewer">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                img: ({node, ...props}) => (
                                                    <img 
                                                        {...props} 
                                                        style={{ 
                                                            width: '100px', 
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }} 
                                                    />
                                                )
                                            }}
                                        >
                                            {formFields.authorDescription || ''}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                <button 
                                    className="changeTxtareaView mx-1"
                                    type="button" 
                                    onClick={() => setShowAuthorPreview(!showAuthorPreview)}
                                >
                                {showPreview ? <span><FaRegEdit />&nbsp;ویرایش محتوا</span> : <span><TbTemplate />&nbsp;پیش نمایش</span>}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='card imageUploadCard p-4 mt-0'>

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
    
                        <Button className='w-100' type="submit">
                            <FaCloudUploadAlt /> &nbsp; ویرایش و مشاهده محصول
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
 
export default EditProduct;