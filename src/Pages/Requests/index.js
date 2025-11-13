
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
import { deleteData, fetchDataFromApi } from "../../utils/api";


const Request = () => {

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

    //backend

    const [reqData, setReqData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi('/api/request').then((res) => {
            setReqData(res);
            
        })

        fetchDataFromApi('/api/client').then((res) => {
            setUserData(res);
            
            context.setProgress(100);
        })
    }, []);

    const [btnDisabled, setBtnDisabled] = useState(false);

    const deleteItem = (id) => {
        context.setProgress(30);
        setBtnDisabled(true);

        deleteData(`/api/request/${id}`).then((res) => {

            fetchDataFromApi('/api/request').then((res) => {
                setReqData(res); 
                context.setProgress(100);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
            });
            
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
            <div className="SectionPage">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">مدیریت درخواست ها :</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/requests'>درخواست ها</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">درخواست ها :</h4>
                                <span className="text-white">{reqData?.length}</span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">همه کاربران :</h4>
                                <span className="text-white">{userData?.length}</span>
                                <div className="icon">
                                    <MdCategory  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card Table shadow border-0 p-3 mt-3">
                    <h3 className="hd">لیست درخواست ها :</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>نام درخواست ها</th>
                                    <th>نام و نام خانوادگی</th>
                                    <th>شماره تماس</th>
                                    <th>آیدی کاربر</th>
                                    <th>زمان ثبت درخواست</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    reqData?.length !== undefined && reqData?.length !== 0 && reqData.map((req, index) => {
                                        return(
                                            <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center mr-2">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="scrollBox">
                                                    {req?.reqName?.map((item, index) => {
                                                        return(
                                                            <span>,&nbsp;{item}&nbsp;</span>
                                                        )
                                                    })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="box">
                                                    {req?.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="box">
                                                    {req?.phone}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="box text-center">
                                                    {
                                                        req?.userId ? <span className="badge badge-danger prerequisite inputFont" onClick={() => copyId(req?.userId)}>{req?.userId}</span> : <b>-</b>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="box">
                                                    {req?.dateCreated}
                                                </div>
                                            </td> 
                                            <td>
                                                <div className="actions d-flex align-items-center">
                                                    <Button onClick={() => deleteItem(req?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
                                                </div>
                                            </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل درخواست ها :
                                {reqData?.length}
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
 
export default Request;