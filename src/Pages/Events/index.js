
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


const Event = () => {

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
    //


    // backend :
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/event').then((res) => {
            setEventData(res);
        })
    }, []);

    const [formFields, setFormFields] = useState({
        name: ''
    })
    const [editId, setEditId] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);

    const inputChange = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name] : e.target.value
            }
        ))
    }

    const addEvent = (e) => {
        e.preventDefault();
        setBtnDisabled(true);

        context.setProgress(30);

        if(editId === ''){
            postData('/api/event/create', formFields).then((res) => {
                //setIsLoading(false);
                setFormFields({
                    name: ""
                });

                fetchDataFromApi('/api/event').then((res) => {
                    setEventData(res);
                    context.setProgress(100);
                })

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            });
        }
        else{
            editData(`/api/event/${editId}`, formFields).then((res) => {
                
                setFormFields({
                    name: ""
                });

                fetchDataFromApi('/api/event').then((res) => {
                    setEventData(res);
                    context.setProgress(100);
                });

                setEditId('');
                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            })
        }
    }

    const editEvent = (id) => {

        fetchDataFromApi(`/api/event/${id}`).then((res) => {
            setEditId(id);
            setFormFields({
                name: res.name
            })
        })
    }

    const deleteEvent = (id) =>{
        setBtnDisabled(true);
        context.setProgress(30);

        deleteData(`/api/event/${id}`).then((res) => {

            fetchDataFromApi('/api/event').then((res) => {
                setEventData(res);
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
                        <h4 className="mx-3">رخداد</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>داشبورد</Link></span>
                            <span>&nbsp; / &nbsp;</span>
                            <span><Link to='/events'>رخداد ها</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #2c75e8, #60aff5)'}}>
                                <h4 className="text-white mb-0">رخداد ها :</h4>
                                <span className="text-white">{eventData?.length}</span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #e1950e, #f3cd29)'}}>
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
                    <form className="form" onSubmit={addEvent}>
                        <h4 className='mb-4'>افزودن رخداد</h4>
                        <div className="row">
                            <div className="col-12 col-md-6">

                                <div className='form-group'>
                                    <h6>نام رخداد</h6>
                                    <input name="name" onChange={inputChange} value={formFields.name} type='text' />
                                </div>

                            </div>

                            <div className="col12 col-md-6 w-100 d-flex">
                                <Button type="submit" className={`${btnDisabled !== false && 'btnDisabled'}`}>
                                    {
                                        editId === '' ? 'ثبت رخداد'  : 'ویرایش رخداد'
                                    }
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`card Table shadow border-0 p-3 mt-3 ${editId !== '' && 'disabled'} `}>
                    <h3 className="hd">لیست رخداد ها</h3>

                    <div className="table-responsive mt-3 widthHalf">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>نام رخداد</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    eventData?.length !== 0 && eventData?.length !== undefined && eventData?.map((item, index) => {
                                        return (
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
                                                    <div className="actions d-flex align-items-center">
                                                        <Button onClick={() => editEvent(item?.id)} className={`success`} color="success"><FaPencilAlt /></Button>
                                                        <Button onClick={() => deleteEvent(item?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل رخداد ها :
                                {eventData?.length}
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
 
export default Event;