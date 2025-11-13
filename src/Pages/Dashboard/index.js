
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button } from "@mui/material";
import Rating from '@mui/material/Rating';
import { AiFillCopyrightCircle } from "react-icons/ai";
import { fetchDataFromApi } from "../../utils/api";

const Dashboard = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []);

    // api calls
    const [productData, setProductData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [userData, setUserData] = useState([]);
    
    useEffect(() => {
        fetchDataFromApi('/api/course').then((res) => {
            setCourseData(res);
        });
    
        fetchDataFromApi('/api/product').then((res) => {
            setProductData(res);
        })

        fetchDataFromApi('/api/client').then((res) => {
            setUserData(res);
        })
    }, []);
    //

    return (
        <>
        <div className="right-content w-100">
            <div className="dashboard">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">داشبورد</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>داشبورد</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">همه کاربران :</h4>
                                <span className="text-white">{userData?.length}</span>
                                <div className="icon">
                                    <FaUserCircle />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">همه سفارشات :</h4>
                                <span className="text-white">26</span>
                                <div className="icon">
                                    <IoMdCart  />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #2c75e8, #60aff5)'}}>
                                <h4 className="text-white mb-0">همه دوره ها :</h4>
                                <span className="text-white">{courseData?.length}</span>
                                <div className="icon">
                                    <GiStarsStack />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #e1950e, #f3cd29)'}}>
                                <h4 className="text-white mb-0">همه محصولات :</h4>
                                <span className="text-white">{productData?.length}</span>
                                <div className="icon">
                                    <MdShoppingBag />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card Table shadow border-0 p-3 mt-4">
                    <h3 className="hd">لیست دوره ها</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>دوره</th>
                                    <th>حوزه</th>
                                    <th>تاریخ شروع</th>
                                    <th>تاریخ پایان</th>
                                    <th>وضعیت</th>
                                    {/*<th>ظرفیت</th>*/}
                                    <th style={{width : '160px'}}>قیمت</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    courseData?.length !== undefined && courseData?.length !== 0 && courseData?.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center mr-2">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img">
                                                                <img className="w-100" src={`${process.env.REACT_APP_BASE_URL}/uploads/${item?.images[0]}`} />
                                                            </div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>
                                                                {item?.name}    
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {item?.field}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="dateBox">
                                                        {item?.startingDate}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="dateBox">
                                                        {item?.EndingDate}
                                                    </div></td>
                                                <td>
                                                    <div className="dateBox">
                                                        {item?.status}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {
                                                            item?.oldPrice !== null && 
                                                            <del className="old">{item?.oldPrice?.toLocaleString()}
                                                            تومان</del>
                                                        }
                                                        <span className="new text-danger"><b>{item?.price?.toLocaleString()}</b>&nbsp;
                                                            تومان
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/courses/${item?.id}`}>
                                                            <Button className='secondary' color="secondary"><FaEye /></Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                                </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل دوره ها : 
                                {courseData?.length}
                            </p>
                            <Button>
                                <Link to='/courses' className="aTag">
                                    <span>ویرایش دوره ها</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>



                <div className="card Table shadow border-0 p-3 mt-5">
                    <h3 className="hd">لیست محصولات</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ردیف</th>
                                    <th style={{width : '300px'}}>نام محصول</th>
                                    <th>حوزه</th>
                                    <th>نویسنده</th>
                                    <th>انبار</th>
                                    <th style={{width : '160px'}}>قیمت</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>
                                
                                {
                                    productData?.length !== undefined && productData?.length !== 0 && productData?.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center mr-2">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img">
                                                                <img className="w-100" src={`${process.env.REACT_APP_BASE_URL}/uploads/${item?.images[0]}`} />
                                                            </div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>
                                                                {item?.name}  
                                                            </h6>
                                                            <p>{item?.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {item?.field}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box text-center">
                                                    {item?.authorName !== '' ? item?.authorName : <b>-</b>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="capacityBox">
                                                        <span><b>{item?.countInStock}</b></span> &nbsp;
                                                        جلد 
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="box">
                                                        {
                                                            item?.oldPrice !== null && 
                                                            <del className="old">{item?.oldPrice?.toLocaleString()}
                                                            تومان</del>
                                                        }
                                                        <span className="new text-danger"><b>{item?.price?.toLocaleString()}</b>&nbsp;
                                                            تومان
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to={`/products/${item?.id}`}>
                                                            <Button className='secondary' color="secondary"><FaEye /></Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                                </tr>
                                        )
                                    })
                                }

                                
                            </tbody>
                        </table>

                        <div className="d-flex align-items-center tableFooter">
                            <p className="mb-0">تعداد کل محصولات :
                                {productData?.length}
                            </p>
                            <Button>
                                <Link to='/products' className="aTag">
                                    <span>ویرایش محصولات</span>
                                </Link>
                            </Button>
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
 
export default Dashboard;