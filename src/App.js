import "./App.css";
import "./Responsive.css";
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Navbar from "./Components/Navbar";
import { createContext, useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Products from "./Pages/Products/productsListing";
import Courses from "./Pages/Courses/coursesListing";
import Service from "./Pages/Service";
import AddCourse from "./Pages/Courses/addCourse";
import AddProduct from "./Pages/Products/addProduct";
import Event from "./Pages/Events";
import Request from "./Pages/Requests";
import UserList from "./Pages/UserList/userList";
import AddUser from "./Pages/UserList/addUser";
import ViewCourse from "./Pages/Courses/viewCourse";
import ViewProduct from "./Pages/Products/viewProduct";
import EditCourse from "./Pages/Courses/editCourse";
import EditProduct from "./Pages/Products/editProduct";
import EditUser from "./Pages/UserList/editUser";

import LoadingBar from "react-top-loading-bar";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { fetchDataFromApi } from "./utils/api";
import AdminList from "./Pages/adminList/adminList";
import AddAdmin from "./Pages/adminList/addAdmin";
import EditAdmin from "./Pages/adminList/editAdmin";
import Orders from "./Pages/orders";

export const MyContext = createContext();

const App = () => {

    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
    const [baseUrl, setBaseUrl] = useState("http://localhost:4001");
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if(theme === "dark"){
          document.body.classList.add('dark');
          document.body.classList.remove('light');
          localStorage.setItem('theme' , 'dark');
        }
        else{
          document.body.classList.add('light');
          document.body.classList.remove('dark');
          localStorage.setItem('theme' , 'light');
        }
    }, [theme]);

    const [isHideSideBarAndHeader, setIsHideSideBarAndHeader] = useState(false);
    const [isToggleSidebar, setIsToggleSidebar] = useState(false);
    const [isOpenNav, setIsOpenNav] = useState(false);

    const openNav = () =>{
        setIsOpenNav(true);
    }

    const closeNav = () =>{
        setIsOpenNav(false);
    }

    // backend :
    const [progress, setProgress] = useState(0);
    const [blurSideNavBar, setBlurSideNavBar] = useState(false);

    const [alertBox, setAlertBox] = useState({
        msg: '',
        error: false,
        open: false
    });

    const handleCloseAlertBox = (event,reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertBox({
            open: false,
        })
    }



    const [user, setUser] = useState({
        name: '',
        email: '',
        userId: ''
    })

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const isSpc = localStorage.getItem("isSpc");
        if(isSpc === 'true'){
            setIsAdmin(true);
        }
        else{
            setIsAdmin(false);
        }
    }, [isLogin]);

    useEffect(() => {

        const token = localStorage.getItem("token");
        if(token !== null && token !== undefined && token !== ''){
            setIsLogin(true);

            const userData = JSON.parse(localStorage.getItem("user"));

            setUser(userData);

        }else{
            setIsLogin(false);
        }

    }, [isLogin]);

    const values = {
        theme,
        setTheme,
        isHideSideBarAndHeader,
        setIsHideSideBarAndHeader,
        isLogin,
        setIsLogin,
        isToggleSidebar,
        setIsToggleSidebar,
        isOpenNav,
        openNav,
        setIsOpenNav,
        closeNav,
        setProgress,
        alertBox,
        setAlertBox,
        baseUrl,
        setBlurSideNavBar,
        user,
        setUser,
        isAdmin,
        setIsAdmin
    }

    return (
        <>
        <BrowserRouter>
            <MyContext.Provider value={values}>

                {/*
                    isRunning !== true && <div className="entireLoading">
                    <CircularProgress sx={() => ({
                        color: theme === 'dark' ? '#fff !important' : '#000',
                        marginleft: '15px',
                    })}
                    enableTrackSlot size="45px"  />&nbsp;&nbsp; لطفا صبر کنید!
                </div>
                */}

                <LoadingBar color="#1866ee" progress={progress} onLoaderFinished={() => setProgress(0)} className='topLoadingBar'/>
                    <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleCloseAlertBox} className="snackBar">
                        <Alert
                            onClose={handleCloseAlertBox}
                            severity={alertBox.error === false ? "success" : "error"}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {alertBox.msg}
                        </Alert>
                    </Snackbar>
                {
                    isHideSideBarAndHeader !== true && <div className={`${blurSideNavBar === true ? 'blurNavbar' : ''}`}><Navbar /></div>
                }
                <div className='main d-flex'>
                    {
                        isHideSideBarAndHeader !== true &&
                        <>
                            <div className={`SidebarOverlay d-none ${isOpenNav === true && 'show'}`} onClick={() => setIsOpenNav(false)}></div>
                            <div className={`sidebarWrapper ${blurSideNavBar === true ? 'blurSideNav' : ''} ${isToggleSidebar === true ? 'toggle' : ''} ${isOpenNav === true ? 'open' : ''}`}>
                                <Sidebar />
                            </div>
                        </>
                    }

                    <div className={`content ${isHideSideBarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/service" element={<Service />} />
                            <Route path="/events" element={<Event />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/requests" element={<Request />} />
                            <Route path="/userList" element={<UserList />} />
                            <Route path="/adminList" element={<AdminList />} />
                            <Route path="/adminList/add" element={<AddAdmin />} />
                            <Route path="/adminList/edit/:id" element={<EditAdmin />} />
                            <Route path="/userList/add" element={<AddUser />} />
                            <Route path="/userList/edit/:id" element={<EditUser />} />
                            <Route path="/courses/upload" element={<AddCourse />} />
                            <Route path="/courses/edit/:id" element={<EditCourse />} />
                            <Route path="/courses/:id" element={<ViewCourse />} />
                            <Route path="/products/upload" element={<AddProduct />} />
                            <Route path="/products/edit/:id" element={<EditProduct />} />
                            <Route path="/products/:id" element={<ViewProduct />} />
                        </Routes>
                    </div>
                </div>
            </MyContext.Provider>
        </BrowserRouter>
        </>
    );
}
 
export default App;