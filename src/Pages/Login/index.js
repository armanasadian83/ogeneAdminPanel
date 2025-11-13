import pattern from "./../../assets/pattern.webp";
import Logo from './../../assets/logo.png';

import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { MdOutlineLightMode } from "react-icons/md";
import { MdNightsStay } from "react-icons/md";
import { CircularProgress } from "@mui/material";
import { postAuthData } from "../../utils/api";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}));

const Login = () => {

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHideSideBarAndHeader(true);
    }, []);


    const focusInput = (index) => {
        setInputIndex(index);
    };

    const changeTheme = () => {
        const theme = localStorage.getItem("theme");
        if(theme === "dark"){
            context.setTheme("light");
        }
        else{
            context.setTheme("dark");
        }
    }

    //backend

    const history = useNavigate();
    const [loader, setLoader] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const [formFields, setFormFields] = useState({
        email: "",
        password: ""
    });

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name] : e.target.value
        }));
    }

    const logIn = (e) => {

        e.preventDefault();
    
        if(formFields.email === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "ایمیل را وارد کنید!"
            });
            return false;
        }

        if(formFields.password === ""){
            context.setAlertBox({
                open: true,
                error: true,
                msg: "رمز عبور را وارد کنید!"
            });
            return false;
        }

        setLoader(true);
        setBtnDisabled(true);
        postAuthData("/api/user/signin", formFields).then((res) => {

            if(res){
                console.log(res);
            }
                        
            try {
                if(res.error !== true){
                //console.log(res);
                if(res?.user?.isAdmin === true){
                    localStorage.setItem("isSpc", res.user?.isAdmin);
                }
    
                localStorage.setItem("token", res.token);
    
                const user={
                    name: res.user?.name,
                    email: res.user?.email,
                    userId: res.user?.id
                }
    
                localStorage.setItem("user", JSON.stringify(user));
    
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "با موفقیت وارد شدید!"
                });
        
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 2000);
                
                setLoader(false);
                }
                else{
                    setLoader(false);
                    setBtnDisabled(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            } catch (error) {
                console.log(error);

                setTimeout(() => {
                    setBtnDisabled(false);
                }, 2000);
            }
        
        }).catch(error => {
            console.error('Error posting data:', error);

            setTimeout(() => {
                setBtnDisabled(false);
            }, 2000);
        });
    }

    

    return (
        <>
        <img src={pattern} className="loginPattern" /> 
        <section className="loginSection">
            <Button className="rounded-circle ms-4" onClick={changeTheme}>
                {
                    context.theme === 'dark' ? <MdNightsStay /> : <MdOutlineLightMode />
                }
            </Button>
            <div className="loginBox">
                <div className="logo text-center">
                    <a href="https://ogenetech.com" target="_blank">
                        <LightTooltip title="مشاهده وبسایت" placement="right">
                            <img src={Logo} />
                        </LightTooltip>
                    </a>
                    <h5 className="mt-1">ورود به پنل مدیریت</h5>
                </div>
                
                <div className="wrapper mt-3 card border p-3">
                    <form onSubmit={logIn}>
                        <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                            <span className="icon"><MdEmail /></span>
                            <input type="text" name="email" onChange={onChangeInput} className="form-control" placeholder="ایمیل خود را وارد کنید" onFocus={() => focusInput(0)}
                                onBlur={() => setInputIndex(null)} autoFocus lang="en" />
                        </div>

                        <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                            <span className="icon"><RiLockPasswordFill /></span>
                            <input type={isShowPassword === true ? 'text' : 'password'} name="password" onChange={onChangeInput} 
                                className="form-control" placeholder="رمز عبور خود را وارد کنید" onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} lang="en" />

                                <span className="toggleShowPassword" onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword === true ? <IoMdEye /> : <IoMdEyeOff />}
                                </span>
                        </div>

                        <div className="form-group">
                            <Button className={`w-100 ${btnDisabled !== false && 'btnDisabled'}`} type="submit">
                                ورود
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
                        </div>

                        <div className="form-group text-center mb-0">
                            <Link to="/" className="link">فراموشی رمز عبور</Link>

                            {/*<Button variant="outlined" className="w-100 btn-lg btn-big loginWithGoogle">
                                <img src="https://static.cdnlogo.com/logos/g/38/google-icon.svg" width="25px" />&nbsp;Sign In with Google
                            </Button>*/}
                        </div>
                    </form>
                </div>

                <div className="wrapper mt-3 card border footer p-3">
                    <span className="text-center">
                        <p>آموزشگاه آزاد نانوزیست فناوری اوژن</p>
                    </span>
                </div>
            </div>
        </section>
        </>
    );
}
 
export default Login;