import { Link, useNavigate, useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";

import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { AiFillCopyrightCircle } from "react-icons/ai";
import { editData, fetchDataFromApi } from "../../utils/api";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const EditUser = () => {

    const context = useContext(MyContext);
    const [isShowPassword, setIsShowPassword] = useState(false);

    useEffect(() => {
        context.setIsHideSideBarAndHeader(false);
    }, []); 

    //backend
    const history = useNavigate();
 
    const [loader, setLoader] = useState(false); 
    const [btnDisabled, setBtnDisabled] = useState(false);

    const [formFields, setFormFields] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    const {id} = useParams();

    useEffect(() => {
        fetchDataFromApi(`/api/client/${id}`).then((res) => {
            setFormFields({
                name: res?.name || "",
                lastName: res?.lastName || "",
                email: res?.email || "",  // Email can be empty
                phone: res?.phone || "",
                password: '',
                confirmPassword: '',
            });
        })
    }, []);

    const editClient = (e) => {
        e.preventDefault();

        // Validate Name (REQUIRED)
        if(formFields.name === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "نام را وارد کنید!"
            });
            return false;
        }

        // CHANGED: Email is now OPTIONAL - only validate if provided
        if(formFields.email && !formFields.email.includes('@')){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "ایمیل معتبر وارد کنید!"
            });
            return false;
        }

        // CHANGED: Phone is REQUIRED
        if(formFields.phone === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن را وارد کنید!"
            });
            return false;
        }

        if(formFields.phone.length !== 11){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن معتبر وارد کنید! (مثال: 09123456789)"
            });
            return false;
        }

        if(!formFields.phone.startsWith('09')){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "شماره تلفن باید با 09 شروع شود!"
            });
            return false;
        }

        // CHANGED: Password is now OPTIONAL for editing
        // Only validate if password is provided
        if(formFields.password && formFields.password.length > 0){
            if(formFields.confirmPassword !== formFields.password){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "رمز عبور ها باهم تطابق ندارند!"
                });
                return false;
            }

            if(formFields.password.length < 7){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "رمز عبور حداقل باید 7 حرف/عدد باشد!"
                });
                return false;
            }

            if(formFields.password.includes(" ")){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "فاصله در رمز عبور مجاز نیست!"
                });
                return false;
            }
        }

        try {

            setLoader(true);
            setBtnDisabled(true);

            // CHANGED: Only send password if it's provided
            const dataToSend = { ...formFields };
            if (!formFields.password) {
                delete dataToSend.password;
                delete dataToSend.confirmPassword;
            }

            editData(`/api/client/${id}`, dataToSend).then((res) => {

                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "کاربر با موفقیت ویرایش شد!"
                });

                setTimeout(() => {
                    history("/userList");
                }, 500);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 1000);

                setLoader(false);

            }).catch(error => {
                console.error('Error posting data:', error);
                setLoader(false);
                setBtnDisabled(false);
            });
            
        }
        catch (error){
            console.log(error);

            setTimeout(() => {
                setBtnDisabled(false);
            }, 1000);
        }
    }


    return (
        <>
        <div className="right-content w-100">
            <div className="addCourseSection">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">ویرایش کاربر</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span>ویرایش کاربر</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="card formCard shadow p-4 mt-4 mb-4">
                    <form className="form" onSubmit={editClient}>
                        <h4 className='mb-4'>اطلاعات کاربر</h4>
                        
                    <div className="row my-4">

                        <div className="col-12 col-md-6">
                            <div className='form-group'>
                                <h6>نام کاربر <span className="text-danger">*</span></h6>
                                <input type='text' name="name" onChange={onChangeInput} value={formFields.name} />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className='form-group'>
                                <h6>نام خانوادگی کاربر</h6>
                                <input type='text' name="lastName" onChange={onChangeInput} value={formFields.lastName} />
                            </div>
                        </div>

                    </div>

                    <div className="row my-4">

                            <div className="col-12 col-md-6">
                                <div className='form-group'>
                                    <h6>آدرس ایمیل <span className="text-muted">(اختیاری)</span></h6>
                                    <input type='email' name="email" onChange={onChangeInput} value={formFields.email || ''} placeholder="example@email.com (اختیاری)" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className='form-group'>
                                    <h6>شماره تلفن <span className="text-danger">*</span></h6>
                                    <input type='text' name="phone" onChange={onChangeInput} value={formFields.phone} placeholder="09123456789" maxLength="11" />
                                    <small className="text-muted">شماره تلفن باید ۱۱ رقم باشد (مثال: 09123456789)</small>
                                </div>
                            </div>

                        </div>

                         <div className="row my-4">
                        
                            <div className="col-12 col-md-6">
                                <div className='form-group'>
                                    <div className="d-flex align-items-center">
                                        <h6>رمز عبور جدید <span className="text-muted">(اختیاری)</span></h6>
                                        <span className="toggleShowPassword mx-2 mb-1" onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {isShowPassword === true ? <IoMdEye /> : <IoMdEyeOff />}
                                        </span>
                                    </div>
                                    <input type={isShowPassword === true ? 'text' : 'password'} name="password" onChange={onChangeInput}
                                        placeholder="برای تغییر رمز عبور وارد کنید"
                                        onKeyDown={(e) => {
                                            if (e.key === " ") e.preventDefault();
                                        }}
                                    />
                                    <small className="text-muted">در صورت تمایل به تغییر رمز عبور، آن را وارد کنید</small>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className='form-group'>
                                    <div className="d-flex align-items-center">
                                        <h6>تکرار رمز عبور جدید <span className="text-muted">(اختیاری)</span></h6> 
                                    </div>
                                    <input type='password' name="confirmPassword" onChange={onChangeInput} 
                                        placeholder="تکرار رمز عبور جدید"
                                    />
                                </div>
                            </div>
                        
                    </div>

                    <Button className={`w-100 ${btnDisabled !== false && 'btnDisabled'}`} type="submit">
                        <FaCloudUploadAlt /> &nbsp; ویرایش کاربر
                            {
                                loader === true && 
                                <CircularProgress
                                    sx={() => ({
                                        color: context.theme === 'dark' ? '#1a0b66ff !important' : '#000',
                                        marginRight: '15px',
                                    })}
                                    enableTrackSlot size="25px" 
                                />
                            }
                    </Button>
                        
                    </form>
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
 
export default EditUser;