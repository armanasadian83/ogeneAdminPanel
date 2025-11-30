
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import UserAvatarImgComponent from '../../Components/userAvatarImg';

import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

import { FaReply } from "react-icons/fa";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Navigation, Autoplay, Pagination} from 'swiper/modules';

import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";
import Fade from '@mui/material/Fade';
import { deleteData, fetchDataFromApi } from "../../utils/api";

import { CiSquareRemove } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";

const ViewCourse = () => {

    const context = useContext(MyContext);
  
    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []);

    //backend

    const {id} = useParams();

    const [courseData, setCourseData] = useState();
    const [ReviewData, setReviewData] = useState();

    useEffect(() => {
      context.setProgress(30);
        fetchDataFromApi(`/api/course/${id}`).then((res) => {
            setCourseData(res);
        });

        fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
            setReviewData(res);
        })
        context.setProgress(100);
    }, [id]);

    const copyId = (id) => {
        navigator.clipboard.writeText(id);
        context.setAlertBox({
            open: true,
            error: false,
            msg: "آیدی کپی شد!"
        })
    }

    const calculateRating = () => {
      let sum = 0;

        if(ReviewData?.length > 0){
            for(var i = 0 ; i < ReviewData?.length ; i++){
                sum = Number(ReviewData[i]?.customerRating) + sum;
            }
          
            const result = sum / ReviewData?.length;
            return(result);
        }
        else{
          return(5);
        }
    }

    const removeComment = (deleteId) => {
      context.setProgress(30);
        deleteData(`/api/productReview/${deleteId}`).then((res) => {

            fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
                setReviewData(res);

                context.setProgress(100);

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "دیدگاه حذف شد!"
                })
                
            });
        })
    }

    return (
        <>
        
        <div className="right-content w-100">
            <div className="courseView">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">مشاهده دوره
                          <Tooltip slots={{
                                transition: Fade,
                              }}
                              slotProps={{
                                transition: { timeout: 300 },
                              }} title='ویرایش' arrow>
                              <Link to={`/courses/edit/${id}`}>
                                  <Button className="rounded-circle me-2">
                                      <CiEdit />
                                  </Button>
                              </Link>
                          </Tooltip>
                        </h4>
                        <div className="me-auto d-flex align-items-center d-none d-md-block">
                            <span><Link to='/'>داشبورد</Link></span>
                            <span>&nbsp; / &nbsp;</span>
                            <span><Link to='/courses/:id'>{courseData?.name}</Link></span>
                        </div>
                    </div>
                </div>

                <div className='card productDetailsSection p-3 my-4'>
                  <div className='row'>
                      <div className='col-12 col-lg-5'>
                          <div className='sliderWrapper pt-3 pb-3 pl-4 pr-4'>
                            <h6 className='mb-4'>گالری دوره</h6>
                            <Swiper 
                              slidesPerView={1}
                              spaceBetween={100}
                              navigation={false}
                              loop={false}
                              modules={[Navigation]}>   
                                  {
                                    courseData?.images?.length !== undefined && courseData?.images?.length !== 0 && courseData?.images?.map((img, index) => {
                                        return(
                                            <SwiperSlide>
                                                <div className='item'>
                                                    <img src={img} className='w-100' />
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })
                                  }
                            </Swiper>
                          </div>
                      </div>
                      
                      <div className='col-12 col-lg-7'>
                        <div className='pt-3 pb-3 pl-4 pr-4 details'>
                          <h6 className='mb-4'>جزئیات دوره</h6>
                          <h4>{courseData?.name}</h4>

                          <div className="p-3">
                              <div className="row py-2">
                                  <div className="col-5 col-md-3">حوزه :</div>
                                  <div className="col-7 col-md-9">{courseData?.field}</div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">تاریخ شروع :</div>
                                  <div className="col-7 col-md-9">{courseData?.startingDate}</div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">تاریخ پایان :</div>
                                  <div className="col-7 col-md-9">{courseData?.EndingDate}</div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">آیدی پیش نیاز :</div>
                                  <div className="col-7 col-md-9">
                                    {courseData?.prerequisite?.length !== undefined && courseData?.prerequisite?.length !== 0 ? courseData?.prerequisite?.map((item, index) => {
                                        return(
                                            <span className="badge prerequisite mx-1" onClick={() => copyId(courseData?.prerequisite)} key={index}>{item}&nbsp;&nbsp;, &nbsp;</span>
                                        )
                                    }) : <b>-</b>
                                  }
                                  </div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">وضعیت :</div>
                                  <div className="col-7 col-md-9">{courseData?.status}</div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">ظرفیت</div>
                                  <div className="col-7 col-md-9">{courseData?.capacity}</div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">رخداد</div>
                                  <div className="col-7 col-md-9">
                                      <div className="d-flex align-items-center flex-wrap">
                                        {
                                          courseData?.event?.length !== undefined && courseData?.event?.length !== 0 ? courseData?.event?.map((event, index) =>{
                                              return(
                                                <span key={index} className="badge badge-danger m-1">{event}</span>
                                              ) 
                                          }) : <b>-</b>
                                        }
                                      </div>
                                  </div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">قیمت :</div>
                                  <div className="col-7 col-md-9">
                                      <del className="mb-0">{courseData?.oldPrice?.toLocaleString()} تومان</del>
                                      <p className="mb-0 newPrice">{courseData?.price?.toLocaleString()} تومان</p>
                                  </div>
                              </div>

                              <div className="row py-2">
                                  <div className="col-5 col-md-3">امتیاز :</div>
                                  <div className="col-7 col-md-9">
                                      <Rating style={{direction : 'ltr'}} value={calculateRating()} precision={0.5} readOnly />
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                  </div>

                  <div className='p-4'>
                    <h6 className='mt-2 mb-3'>درباره دوره</h6>
                    <p style={{whiteSpace: 'pre-line'}}>
                      {courseData?.description}
                    </p>


                    <br />

                    <div className="row"> 
                      <div className="col-12 col-lg-6">
                          <h6 className='mt-2 mb-3'>سرفصل دوره :</h6>
                          <p style={{whiteSpace: 'pre-line'}}>
                          {courseData?.headline !== '' ? courseData?.headline : <span className="text-muted"><CgDanger />محتوای سرفصل دوره خالی است!</span>}
                          </p>
                      </div>

                      <div className="col-12 col-lg-6">
                          <h6 className='mt-2 mb-3'>درباره مدرس:</h6>
                          <p style={{whiteSpace: 'pre-line'}}>
                            {courseData?.aboutTeacher !== '' ? courseData?.aboutTeacher : <span className="text-muted"><CgDanger />محتوای درباره مدرس خالی است!</span>}
                          </p>
                      </div>
                    </div>
                    <h6 className='mt-2 mb-4'>نظرات کاربران</h6>

                    <div className='reviewsSection'>

                      {
                        ReviewData?.length !== undefined && ReviewData?.length !== 0 ? ReviewData?.map((item, index) => {
                            return(
                                <div className='reviewsRow' key={index}>
                                    <div className='row'>
                                      <div className='col-sm-7 d-flex'>

                                        <div className='d-flex flex-column'>                             
                                          <div className='userInfo d-flex align-items-center mb-3'>
                                              <div onClick={() => removeComment(item?.id)} className="removeComment"><CiSquareRemove /></div>

                                            <div className='info pl-3'>
                                              <h5>{item?.customerName}</h5>
                                              <span className='iadd-time'>{item?.dateCreated}</span>
                                            </div>

                                          </div>

                                          <Rating style={{direction : 'ltr'}} value={item?.customerRating} precision={0.5} readOnly />

                                        </div>
                                      </div>

                                      <div className='col-md-5 d-flex align-items-center'>
                                        <div className='ml-auto'>
                                          {/*<Button className='btn-blue btn-big btn-lg ml-auto'><FaReply /> &nbsp; پاسخ </Button>*/}
                                        </div>
                                      </div>

                                      <p className='mt-3'>
                                          {item?.review}
                                      </p>

                                    </div>
                                  </div>
                            )
                        }) : <span className="text-muted">هنوز کاربری برای این دوره دیدگاهی ثبت نکرده است!</span>
                      }

                      {/*<div className='reviewsRow reply'>
                        <div className='row'>
                          <div className='col-sm-7 d-flex'>

                            <div className='d-flex flex-column'>                             
                              <div className='userInfo d-flex align-items-center mb-3'>

                                <div className='info pl-3'>
                                  <h5>کارشناس پیشتبانی</h5>
                                  <span className='iadd-time'>12:35 1404/02/04</span>
                                </div>

                              </div>

                            </div>
                          </div>

                          <div className='col-md-5 d-flex align-items-center'>
                            <div className='ml-auto'>
                              <Button className='btn-blue btn-big btn-lg ml-auto'><FaReply /> &nbsp; پاسخ </Button>
                            </div>
                          </div>

                          <p className='mt-3'>
                              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف
                          </p>

                        </div>
                      </div>*/}

                    </div>

                    <br />

                    {/*<h6 className='mt-2 mb-4'>پاسخ دادن به</h6>

                    <form className='reviewForm'>
                      <textarea disabled={true} placeholder="در حال توسعه"></textarea>

                      <Button className='sendReply mt-3' disabled={true}>ارسال پاسخ</Button>
                    </form>*/}

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
 
export default ViewCourse;