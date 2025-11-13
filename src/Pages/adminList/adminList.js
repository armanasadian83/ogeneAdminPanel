
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

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

import { LuPenOff } from "react-icons/lu";


const AdminList = () => {

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

    const [categoryVal, setCategoryVal] = useState("");

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
    const history = useNavigate();
    useEffect(() => {
        const isSpc = localStorage.getItem("isSpc");
        if(isSpc === null || isSpc === undefined || isSpc === ''){
            history('/');
        }
    }, []);

    const [adminList, setAdminList] = useState([]);

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi('/api/user').then((res) => {
            setAdminList(res);
            context.setProgress(100);
        });
    }, []);

    const [btnDisabled, setBtnDisabled] = useState(false);

    const deleteAdmin = (id) => {
        context.setProgress(30);
        setBtnDisabled(true);

        deleteData(`/api/user/${id}`).then((res) => {

            fetchDataFromApi('/api/user').then((res) => {
                setAdminList(res);
                context.setProgress(100);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);
            });
        })
    }

    return (
        <>
        <div className="right-content w-100">
            <div className="SectionPage">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">لیست ادمین ها</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/service'>لیست ادمین ها</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">ادمین ها:</h4>
                                <span className="text-white">{adminList?.length}</span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">کاربران:</h4>
                                <span className="text-white">3</span>
                                <div className="icon">
                                    <MdCategory  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card Table shadow border-0 p-3 mt-3">
                    <h3 className="hd">لیست ادمین ها</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>اطلاعات ادمین</th>
                                    <th>ایمیل</th>
                                    <th>شماره تماس</th>
                                    <th>زمان ساخت اکانت</th>
                                    <th>آخرین ویرایش</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    adminList?.length !== undefined && adminList?.length !== 0 && adminList?.map((admin, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center mr-2">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="userBox inputFont">
                                                        {admin?.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="userBox inputFont">
                                                        {admin?.email}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {admin?.phone}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {admin?.dateCreated}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {admin?.dateEdited}
                                                    </div>
                                                </td>
                                                <td> 
                                                    <div className="actions d-flex align-items-center">
                                                        {
                                                            admin?.id !== '690a6b9d37e779a0abd74979' ? 
                                                            <>
                                                                <Link to={`${btnDisabled !== true ? `/adminList/edit/${admin?.id}` : '/products'} `}>
                                                                    <Button className={`success ${btnDisabled !== false && 'btnDisabled'}`} color='success' ><FaPencilAlt /></Button>
                                                                </Link>
                                                                <Button onClick={() => deleteAdmin(admin?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
                                                            </> : <div className="text-center w-100"><LuPenOff /></div>
                                                        }
                                                    </div>
                                                </td> 
                                            </tr>            
                                        )
                                    })
                                }                   
                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل ادمین ها:
                                {adminList?.length}
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
 
export default AdminList;