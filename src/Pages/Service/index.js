
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, MenuItem, Select } from "@mui/material";
import Rating from '@mui/material/Rating';
import { AiFillCopyrightCircle } from "react-icons/ai";

import { MdCategory } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";


const Service = () => {

    const context = useContext(MyContext);
        
    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []);

    const [formFields, setFormFields] = useState({
        name: '',
        field: ''
    });

    const [categoryVal, setCategoryVal] = useState("");

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);

        setFormFields(() => (
            {
                ...formFields,
                field: event.target.value
            }
        ))
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
    //


    //backend

    const [serviceData, setServiceData] = useState([]);
    const [editId, setEditId] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        fetchDataFromApi('/api/service').then((res) => {
            setServiceData(res);
        })
    }, []);


    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }))
    }

    const addService = (e) => {
        e.preventDefault();
        setBtnDisabled(true);

        context.setProgress(30);

        if(editId === ''){
            postData('/api/service/add', formFields).then((res) => {
                //setIsLoading(false);
                setFormFields({
                    name: "",
                    field: ''
                });

                fetchDataFromApi('/api/service').then((res) => {
                    setServiceData(res);
                    context.setProgress(100);
                    setCategoryVal('');
                })

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            });
        }
        else{
            editData(`/api/service/${editId}`, formFields).then((res) => {
                
                setFormFields({
                    name: "",
                    field: ''
                });

                fetchDataFromApi('/api/service').then((res) => {
                    setServiceData(res);
                    context.setProgress(100);
                    setCategoryVal('');
                });

                setEditId('');
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            })
        }
    }


    const editService = (id) => {

        fetchDataFromApi(`/api/service/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                name: res.name,
                field: res.field
            });
            setCategoryVal(res.field);
        })
    }


    const deleteService = (id) =>{
        setBtnDisabled(true);
        context.setProgress(30);

        deleteData(`/api/service/${id}`).then((res) => {

            fetchDataFromApi('/api/service').then((res) => {
                setServiceData(res);
                context.setProgress(100);
            })

            setTimeout(() => {
                setBtnDisabled(false);
            }, 1000);

        })
    }

    return (
        <>
        <div className="right-content w-100">
            <div className="SectionPage">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">خدمات</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>داشبورد</Link></span>
                            <span>&nbsp; / &nbsp;</span>
                            <span><Link to='/service'>مدیریت خدمات</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">خدمات :</h4>
                                <span className="text-white">{serviceData?.length}</span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">همه حوزه ها :</h4>
                                <span className="text-white">6</span>
                                <div className="icon">
                                    <MdCategory  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card formCard shadow p-3 mt-2 mb-4">
                    <form className="form" onSubmit={addService}>
                        <h4 className='mb-4'>افزودن خدمت</h4>
                        <div className="row">
                            <div className="col-12 col-md-6">

                                <div className='form-group'>
                                    <h6>نام خدمت</h6>
                                    <input name="name" value={formFields.name} onChange={inputChange} type='text' />
                                </div>

                            </div>

                            <div className="col-12 col-md-6">

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

                            <div className="col12 col-md-6 w-100 d-flex">
                                <Button type="submit" className={`${btnDisabled !== false && 'btnDisabled'}`}>
                                    {
                                        editId === '' ? 'ثبت خدمت'  : 'ویرایش خدمت'
                                    }
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="card Table shadow border-0 p-3 mt-3">
                    <h3 className="hd">لیست خدمات</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>نام خدمت</th>
                                    <th>حوزه</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    serviceData?.length !== undefined && serviceData?.length !== 0 && serviceData?.map((item, index) => {
                                        return( 
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center mr-2">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="userBox">
                                                        {item?.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {item?.field}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Button onClick={() => editService(item?.id)} className={`success`} color="success"><FaPencilAlt /></Button>
                                                        <Button onClick={() => deleteService(item?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل خدمات :
                                {serviceData?.length}
                            </p>
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
        </>
    );
}
 
export default Service;