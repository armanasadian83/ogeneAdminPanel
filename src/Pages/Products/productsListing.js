
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

import { MdCategory } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const Products = () => {

    const context = useContext(MyContext);
    
    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
        context.setBlurSideNavBar(false);
    }, []);

    const [productData, setProductData] = useState([]);

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi('/api/product').then((res) => {
            setProductData(res);
            context.setProgress(100);
        })
    }, []);

    const [btnDisabled, setBtnDisabled] = useState(false);

    const deleteItem = (id) => {
        context.setProgress(30);
        setBtnDisabled(true);
        deleteData(`/api/product/${id}`).then((res) => {

            fetchDataFromApi('/api/product').then((res) => {
                setProductData(res);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
                context.setProgress(100);
            })
        })
    }

    return (
        <>
        <div className="right-content w-100">
            <div className="dashboard">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">محصولات</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>داشبورد</Link></span>
                            <span>&nbsp; / &nbsp;</span>
                            <span><Link to='/products'>لیست محصولات</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">همه محصولات:</h4>
                                <span className="text-white">{productData?.length}</span>
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

                <div className="card Table shadow border-0 p-3 mt-3">
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
                                    <th>رخداد</th>
                                    <th>امتیاز</th>
                                    <th>زمان افزودن محصول</th>
                                    <th>آخرین ویرایش</th>
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
                                                <Link to={`/products/${item?.id}`} className="d-flex align-items-center productBox">
                                                    <div className="imgWrapper">
                                                        <div className="img">
                                                            <img className="w-100" src={item?.images[0]} />
                                                        </div>
                                                    </div>
                                                    <div className="info pl-3">
                                                        <h6>
                                                            {item?.name}
                                                        </h6>
                                                        <p>{item?.description}</p>
                                                    </div>
                                                </Link>
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
                                                    عدد
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
                                                <div className="eventBox text-center"> 
                                                    {
                                                        item?.event?.length !== 0 ? item?.event?.map((event, index) => {
                                                            return(
                                                                <>
                                                                <div className="badge badge-danger" key={index}>{event}</div> <br />
                                                                </>
                                                            )
                                                        }) : <b>-</b>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <Rating style={{direction: 'ltr'}} readOnly value={item?.rating} precision={0.5} size="small"/>
                                            </td>
                                            <td>
                                                <div className="box text-center">
                                                    {item?.dateCreated}
                                                </div>
                                            </td> 
                                            <td>
                                                <div className="box text-center">
                                                    {item?.dateEdited !== '' ? item?.dateEdited : <b>-</b>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions d-flex align-items-center">
                                                    <Link to={`${btnDisabled !== true ? `/products/${item?.id}` : '/products'} `}>
                                                        <Button className={`secondary ${btnDisabled !== false && 'btnDisabled'}`} color="secondary"><FaEye /></Button>
                                                    </Link>
                                                    <Link to={`${btnDisabled !== true ? `/products/edit/${item?.id}` : '/products'} `}>
                                                        <Button className={`success ${btnDisabled !== false && 'btnDisabled'}`} color='success' ><FaPencilAlt /></Button>
                                                    </Link>
                                                    <Button onClick={() => deleteItem(item?.id)} className={`error ${btnDisabled !== false && 'btnDisabled'}`} color="error"><MdDelete /></Button>
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
 
export default Products;