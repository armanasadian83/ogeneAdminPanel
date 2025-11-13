import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, Checkbox, CircularProgress, ListItemText, MenuItem, Select } from "@mui/material";

import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { editData, fetchDataFromApi, postData } from "../../utils/api";

import { CiEraser } from "react-icons/ci";

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

    //

    // dividing 3 digits //
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        
        const formattedValue = rawValue === '' ? '' : Number(rawValue).toLocaleString();
        
        setValue(formattedValue);
    };



    //backend
    const [eventData, setEventdata] = useState([]);
    const {id} = useParams();
    
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
            setPreviews(res.images);
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

    const [isSelectedImages, setIsSelectedImages] = useState(false);
    const formdata = new FormData();
    const [files, setFiles] = useState([]);
    const [imgFiles, setimgFiles] = useState();
    const [previews, setPreviews] = useState();

    const onChangeFile = async(e, apiEndPoint) => {
        try {
            const imgArr = [];
            const files = e.target.files;
            //const fd = new formData();
            for(var i = 0; i < files.length; i++){
                if(files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png' || files[i].type === 'image/png')){
                    setimgFiles(e.target.files);

                    const file = files[i];
                    imgArr.push(file);
                    formdata.append(`images`, file); 
                }
                else{
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: "یک عکس با فرمت مناسب انتخاب کنید!"
                    })
                    return;
                }
            }

            setFiles(imgArr);
            //console.log(imgArr);

            setIsSelectedImages(true);
            
            postData(apiEndPoint, formdata).then((res) => {
                //console.log(res);
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
            if(isSelectedImages === false){
                formdata.append('images', formFields.images);
            }
    
    
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
    
            setIsLoading(true);
    
            // submitting form in the database
            editData(`/api/product/${id}`, formFields).then((res) => {
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
    
                history('/products');
            })
        
        }

        const clearEventVal = () => {
            setEventVal([]);
            handleChangeEvent('');
        }


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
                                <textarea name="description" onChange={inputChange} value={formFields.description} type='text' cols={2} placeholder=""></textarea>
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
                                <input name="oldPrice" onChange={inputChange} value={formFields.oldPrice} type='text' 
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
                                <input name="price" onChange={inputChange} value={formFields.price} type='text' /*value={value} onChange={handleChange}*/ 
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
                                <textarea name="authorDescription" onChange={inputChange} value={formFields.authorDescription} cols={20}></textarea>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='card imageUploadCard p-4 mt-0'>

                    <div className='imagesUploadSec'>
                        <h5 className='mb-4'>آپلود تصویر</h5>
                        <div className='imgUploadBox d-flex align-items-center'>
                            {
                                previews?.length !== 0 && previews?.map((img, index) => {
                                    return (
                                        <div className='uploadBox' key={index}>
                                            {
                                                isSelectedImages === true ?
                                                <img src={`${img}`} className='w-100' />
                                                :
                                                <img src={`${process.env.REACT_APP_BASE_URL}/uploads/${img}`} className='w-100' />
                                            }
                                        </div>
                                    )
                                })
                            }
                            <div className='uploadBox'>
                                <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/product/upload')} name='images' />
                                <div className='info'>
                                    <FaRegImages />
                                    <h5>تغییر تصویر</h5>
                                </div>
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