import {Link} from "react-router-dom";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdCategory } from "react-icons/md"; 

import { FaLaptopCode } from "react-icons/fa";

import { AiFillCopyrightCircle } from "react-icons/ai";

const Orders = () => {
    return (
        <>
        <div className="right-content w-100">
            <div className="OrderPage">
                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">سفارشات :</h4>
                        <div className="me-auto d-flex align-items-center">
                            <div className="hideInMobile">
                                <span><Link to='/'>داشبورد</Link></span>
                                <span>&nbsp; / &nbsp;</span>
                                <span><Link to='/requests'>سفارش ها</Link></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #60aff5, #2c75e8)'}}>
                                <h4 className="text-white mb-0">درخواست ها :</h4>
                                <span className="text-white"></span>
                                <div className="icon">
                                    <MdOutlineProductionQuantityLimits />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #f3cd29, #e1950e)'}}>
                                <h4 className="text-white mb-0">همه کاربران :</h4>
                                <span className="text-white"></span>
                                <div className="icon">
                                    <MdCategory  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h5>در حال توسعه... <FaLaptopCode style={{fontSize: '40px'}} /></h5>
                </div>


                {/*<div className="text-center copyright mt-5 mb-3">
                    <a target="_blank" href="https://armanassadian.ir">
                        <span>توسعه داده شده توسط تیم فیوژن</span> &nbsp;
                    </a>
                    <AiFillCopyrightCircle />
                </div>*/}
            </div>
        </div>
        </>
    );
}
 
export default Orders;