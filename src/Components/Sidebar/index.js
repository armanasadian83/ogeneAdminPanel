import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleLeft, FaShopify } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '../../App';

import { PiBooksFill } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaServicestack } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import { BsCartCheck } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { ImUsers } from 'react-icons/im';
import { FcCustomerSupport } from 'react-icons/fc';
import { GrUserAdmin } from "react-icons/gr";

const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    // using context
    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }


    //backend
    const history = useNavigate();
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
        <div className="sidebar">

            <div className='d-flex align-items-center sideBarAccessBtns'>
                <Button className="rounded-circle ms-2">
                    <FaShopify />
                </Button>
                <Button className="rounded-circle ms-2">
                    <ImUsers />
                </Button>
                <Link to='https://t.me/Armi320'>
                    <Button className="rounded-circle ms-2">
                        <FcCustomerSupport />
                    </Button>
                </Link>
            </div>

            <ul>
                <li>
                    <Link to="/" onClick={() => context.closeNav()}>
                        <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                            <span className='icon'><MdDashboard className='ms-2' /></span>
                            داشبورد
                            <span className='arrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to='/products'>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><PiBooksFill className='ms-2' /></span>
                            محصولات
                            <span className='arrow submenuArrow'><FaAngleLeft /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li onClick={() => context.closeNav()}><Link to="/products">لیست محصولات</Link></li>
                                <li onClick={() => context.closeNav()}><Link to="/products/upload">آپلود محصول</Link></li>
                            </ul>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to="/courses">
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className='icon'><FaChalkboardTeacher className='ms-2' /></span>
                            دوره ها
                            <span className='arrow submenuArrow'><FaAngleLeft /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li onClick={() => context.closeNav()}><Link to="/courses">لیست دوره ها</Link></li>
                                <li onClick={() => context.closeNav()}><Link to="/courses/upload">آپلود دوره</Link></li>
                            </ul>
                        </div>
                    </Link>
                </li>
                <li>
                    <Link to="/service" onClick={() => context.closeNav()}>
                        <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className='icon'><FaServicestack className='ms-2' /></span>
                            خدمات
                            <span className='arrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to="/events" onClick={() => context.closeNav()}>
                        <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className='icon'><MdEventAvailable className='ms-2' /></span>
                            رخداد ها
                            <span className='arrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to="/requests" onClick={() => context.closeNav()}>
                        <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                            <span className='icon'><FaCodePullRequest className='ms-2' /></span>
                            درخواست ها
                            <span className='arrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to="/orders" onClick={() => context.closeNav()}>
                        <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                            <span className='icon'><BsCartCheck className='ms-2' /></span>
                            سفارشات
                            <span className='arrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                </li>
                <li>
                    <Link to="/userList">
                        <Button className={`w-100 ${activeTab === 7 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                            <span className='icon'><FaUserGroup className='ms-2' /></span>
                            کاربران
                            <span className='arrow submenuArrow'><FaAngleLeft /></span>
                        </Button>
                    </Link>
                     <div className={`submenuWrapper ${activeTab === 7 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                        <ul className='submenu'>
                            <li onClick={() => context.closeNav()}><Link to="/userList">لیست کاربران</Link></li>
                            <li onClick={() => context.closeNav()}><Link to="/userList/add">افزودن کاربر</Link></li>
                        </ul>
                    </div>
                </li>
                {
                    context.isAdmin === true && 
                    <li>
                        <Link to="/adminList">
                            <Button className={`w-100 ${activeTab === 8 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                                <span className='icon'><GrUserAdmin className='ms-2' /></span>
                                مدیریت پنل
                                <span className='arrow submenuArrow'><FaAngleLeft /></span>
                            </Button>
                        </Link>
                         <div className={`submenuWrapper ${activeTab === 8 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li onClick={() => context.closeNav()}><Link to="/adminList">لیست ادمین ها</Link></li>
                                <li onClick={() => context.closeNav()}><Link to="/adminList/add">افزودن ادمین</Link></li>
                            </ul>
                        </div>
                    </li>
                }
            </ul>

            <br />

            <div className='logoutWrapper'>
                <div className='logoutBox'>
                    <Button className={`${btnDisabled !== false && 'btnDisabled'}`} onClick={logout} variant='contained'>خروج<IoMdLogOut className='mx-2' /></Button>
                </div>
            </div>
        </div>
        </>
    );
}
 
export default Sidebar;