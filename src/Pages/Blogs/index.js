import { ImUsers } from "react-icons/im";
import { Link } from "react-router-dom";
import { FaBlog, FaDev } from "react-icons/fa";

const Blog = () => {
    return (
        <>
        <div className="right-content w-100">
            <div className="LogPage">

                <div className="card breadCrumb shadow border-0 mt-1">
                    <div className="d-flex align-items-center py-2 px-4">
                        <h4 className="mx-3">داشبورد</h4>
                        <div className="me-auto d-flex align-items-center">
                            <span><Link to='/'>بلاگ ها</Link></span>
                        </div>
                    </div>
                </div>

                <div className="infoSection">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #1da256, #48d483)'}}>
                                <h4 className="text-white mb-0">همه بلاگ ها :</h4>
                                <span className="text-white">0</span>
                                <div className="icon">
                                    <FaBlog />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="infoBox" style={{backgroundImage : 'linear-gradient(to right, #c012e2, #eb64fb)'}}>
                                <h4 className="text-white mb-0">همه کاربران :</h4>
                                <span className="text-white">0</span>
                                <div className="icon">
                                    <ImUsers  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="me-3"> 
                    <FaDev size={28} /> &nbsp;
                    این صفحه در حال توسعه است. 
                </p>

            </div>
        </div>
        </>
    );
}
 
export default Blog;