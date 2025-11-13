import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { MdMenuOpen, MdOutlineLightMode, MdOutlineMenu } from "react-icons/md";
import { MdNightsStay } from "react-icons/md";
import Logo from './../../assets/logo.png';
import UserAvatarImgComponent from "../userAvatarImg";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { BsShieldFillExclamation } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";

import { FaShopify } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import { IoMdGlobe } from "react-icons/io";

import { MyContext } from "../../App";
import { Tooltip } from "@mui/material";
import Fade from '@mui/material/Fade';

import { useNavigate } from "react-router-dom";
import { FcCustomerSupport } from "react-icons/fc";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const openMyAcc = Boolean(anchorEl);
    const context = useContext(MyContext);
    const history = useNavigate();

    const handleOpenMyAccDrop = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
      setAnchorEl(null);
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
    const [btnDisabled, setBtnDisabled] = useState(false);

    const logout = () => {
        setBtnDisabled(true);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isSpc");
        context.setAlertBox({
            open: true,
            error: false,
            msg: "با موفقیت خارج شدید!"
        });

        setAnchorEl(null);

        setTimeout(() => {
            history('/login');
        }, 1000);

        setTimeout(() => {
            setBtnDisabled(false);
        }, 2000);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token !== null && token !== undefined && token !== ''){
            context.setIsLogin(true);
        }else{
            //window.location.href = '/login'
            history('/login');
        }
    }, []);

    return (
        <>
        <header className="d-flex align-items-center">
            <div className="container-fluid w-100">
                <div className="row d-flex align-items-center w-100">
                    <div className="col-12 col-md-4 part1">
                        <Link to="/" className="d-flex align-items-center logo">
                            <img src={Logo} />
                            <span className="d-none d-md-block">پنل مدیریت وبسایت اوژن</span>
                        </Link>
                    </div>
                    

                    <div className="col-8 d-flex align-items-center justify-content-end part3 pl-4">

                            <Button className="rounded-circle ms-4 hideinPc" onClick={() => context.openNav()}><IoMenu /></Button>
                            <Button className="rounded-circle ms-4 " onClick={changeTheme}>
                            {
                                context.theme === 'dark' ? <MdNightsStay /> : <MdOutlineLightMode />
                            }
                            </Button>
                            <Tooltip slots={{
                                  transition: Fade,
                                }}
                                slotProps={{
                                    transition: { timeout: 600 },
                                }} title='مشاهده وبسایت' arrow>
                                <Button className="rounded-circle ms-4">
                                        <a href='https://ogenetech.com' target="_blank"><IoMdGlobe /></a>
                                </Button>
                            </Tooltip>
                            <Link to='/orders'>
                                <Button className="rounded-circle ms-4 hideInMobile">
                                    <FaShopify />
                                </Button>
                            </Link>
                            <Link to='/userList'>
                                <Button className="rounded-circle ms-4 hideInMobile">
                                    <ImUsers />
                                </Button>
                            </Link>
                            <Link to='https://t.me/Armi320' className="hideInMobile">
                                <Button className="rounded-circle ms-4">
                                    <FcCustomerSupport />
                                </Button>
                            </Link>
                        <Button className="rounded-circle account ms-4 hideinPc-to-992" onClick={handleOpenMyAccDrop}>KM</Button>


                            <div className="myAccWrapper">
                                <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                    {/*<UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" />*/}
                                    
                                    {
                                        context.isLogin === true && 
                                        <>
                                        <div className="userInfo res-hide-to-992">
                                            <h4>{context.user?.name}</h4>
                                            <p className="mb-0">{context.user?.email}</p>
                                        </div>
                                        </>
                                    }
                                
                                </Button>

                                <Menu className="menuInMobile" anchorEl={anchorEl} id="account-menu" open={openMyAcc} onClose={handleCloseMyAccDrop} 
                                onClick={handleCloseMyAccDrop}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>                 
                                    <MenuItem className="menuItemInMobile" onClick={handleCloseMyAccDrop}>
                                        <ListItemIcon>
                                            <FaUser/>
                                        </ListItemIcon>
                                        حساب من
                                    </MenuItem>
                                    <MenuItem className="menuItemInMobile" onClick={handleCloseMyAccDrop}>
                                      <ListItemIcon>
                                            <BsShieldFillExclamation />
                                      </ListItemIcon>
                                      تغییر رمز عبور
                                    </MenuItem>
                                    <MenuItem className={`menuItemInMobile ${btnDisabled !== false && 'btnDisabled'}`} onClick={logout}>
                                        <ListItemIcon>
                                            <BiLogOut fontSize="small" />
                                        </ListItemIcon>
                                        خروج از حساب     
                                    </MenuItem>
                                </Menu>
                            </div>

                    </div>
                </div>
            </div>
        </header>
        </>
    );
}
 
export default Navbar;