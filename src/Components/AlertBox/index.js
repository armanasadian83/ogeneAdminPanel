import { useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import { MyContext } from "../../App";

const AlertBox = () => {

    const context = useContext(MyContext);

    const handleCloseAlert = () => {
        localStorage.setItem('alertDismissed', 'true');
        context.setIsAlertOpen(false);
    };

    return (
        <>
        <div className="alertbox text-center w-100">
            <div className="box relative">
                <h4><MdOutlineSignalWifiStatusbarConnectedNoInternet4 />&nbsp;مشکل در شبکه کشور</h4>
                <p>
                    متاسفانه اتصال اینترنت در حال حاضر محدود به منازل و اینترنت‌های غیر دیتاسنتری است، لذا اتصال سرورها همچنان به اینترنت برقرار نمی‌باشد. همچنین پیش‌بینی می‌شود با اتصال تدریجی سرورها به اینترنت، به دلیل اختلال ناشی از تجهیزات شرکت زیرساخت، مدتی packet loss بر روی لینک‌های بین‌المللی دیده شود.
                    توصیه میکنیم با اینترنت متصل و پایدار از خدمات پنل مدیریت استفاده کنید و در صورت بروز هر گونه مشکل با 
                    پشتیبانی ارتباط برقرار کنید.
                    <br />
                    در این روزهای دشوار، برای شما آرامش و امنیت آرزو می‌کنیم.
                </p>
                <span className="" onClick={() => context.setIsAlertOpen(false)}>
                    <svg><IoMdClose /></svg>
                </span>

                <button onClick={handleCloseAlert}>فهمیدم، این پیام مجدداً نمایش داده نشود</button>
            </div>
        </div>
        </>
    );
}
 
export default AlertBox;