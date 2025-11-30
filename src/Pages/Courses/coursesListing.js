import { Button, Rating } from "@mui/material";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import { MdCategory, MdDelete, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { Link } from "react-router-dom";
import { BiLogoDiscourse } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";

import { deleteData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const Courses = () => {

    const context = useContext(MyContext);

    useEffect(() => {
        context.setBlurSideNavBar(false); 
    }, []);

    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        context.setProgress(30);
        fetchDataFromApi('/api/course').then((res) => {
            setCourseData(res);
            context.setProgress(100);
        })
    }, []);

    const [btnDisabled, setBtnDisabled] = useState(false);

    const deleteItem = (id) => {
        context.setProgress(30);
        setBtnDisabled(true);
        deleteData(`/api/course/${id}`).then((res) => {

            fetchDataFromApi('/api/course').then((res) => {
                setCourseData(res);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 500);
                context.setProgress(100);
            })
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
            <div className="dashboard">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">دوره ها</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>داشبورد</Link></span>
                            <span>&nbsp; / &nbsp;</span>
                            <span><Link to='/courses'>لیست دوره ها</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #f3cd29, #e1950e)'}}>
                                <h4 className="text-white mb-0">همه دوره ها:</h4>
                                <span className="text-white">{courseData?.length}</span>
                                <div className="icon">
                                    <BiLogoDiscourse />
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
                                    <th>پیش نیاز</th>
                                    <th>وضعیت</th>
                                    <th>ظرفیت</th>
                                    <th style={{width : '160px'}}>قیمت</th>
                                    <th>رخداد</th>
                                    {/*<th>امتیاز</th>*/}
                                    <th>زمان افزودن دوره</th>
                                    <th>آخرین ویرایش</th>
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
                                                    <Link to={`/courses/${item?.id}`} className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img">
                                                                <img className="w-100" src={item?.images[0]} />
                                                            </div>
                                                        </div>
                                                        <div className="info pl-3">
                                                            <h6>
                                                                {item?.name}
                                                            </h6>
                                                        </div>
                                                    </Link>
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
                                                    <div className="box text-center">
                                                        {
                                                            item?.prerequisite?.length !== undefined && item?.prerequisite?.length !== 0 ? item?.prerequisite?.map((item, index) => {
                                                                return(
                                                                    <>
                                                                    <div className="badge badge-danger prerequisite inputFont" key={index} onClick={() => copyId(item)}>{item}</div> <br />
                                                                    </>
                                                                )
                                                            }) : <b>-</b>
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="dateBox">
                                                        {item?.status}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="capacityBox">
                                                        {item?.capacity}&nbsp;
                                                        نفر
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
                                                {/*<td>
                                                    <Rating style={{direction: 'ltr'}} readOnly value={item?.rating} precision={0.5} size="small"/>
                                                </td>*/}
                                                <td>
                                                    <div className="box">
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
                                                        <Link to={`${btnDisabled !== true ? `/courses/${item?.id}` : '/courses'} `}>
                                                            <Button className={`secondary ${btnDisabled !== false && 'btnDisabled'}`} color="secondary"><FaEye /></Button>
                                                        </Link>
                                                        <Link to={`${btnDisabled !== true ? `/courses/edit/${item?.id}` : '/courses'} `}>
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
                            <p className="mb-0">تعداد کل دوره ها : 
                                {courseData?.length}
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
 
export default Courses;