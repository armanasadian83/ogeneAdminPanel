import axios from "axios";
//require('dotenv/config');
//console.log(process.env.REACT_APP_BASE_URL);

export const fetchDataFromApi = async(url) => {
    try{
        const {data} = await axios.get(process.env.REACT_APP_BASE_URL +url) 
        return data;
    }catch(error){
        console.log(error);
        return error;
    }
}

// vid 41 : specail api for login/signup
export const postAuthData = async (url, formData) => {

    try {
        const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.json();
        }

    } catch (error) {
        console.log(error);
        return error; 
    }

}

export const postData = async (url, formData) => {
    try {
        const res = await axios.post(process.env.REACT_APP_BASE_URL + url, formData)
        return res.data;
    } catch (error) {
        console.log(error);
        return error;       
    }
}

export const editData = async (url, updatedData) => {
    try{
        const {res} = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}` ,updatedData);
        return res;
    } catch (error){
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const {res} = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`);
        return res;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const editOrderStatus = async (url, updatedData) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`, updatedData);
        return response.data;
    } catch (error) {
        console.log(error);
        return error;
    }
}




// Gallery API functions
export const getGalleryImages = async (filter = 'all') => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/gallery/images`, {
            params: { filter }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};

export const deleteGalleryImage = async (fileKey) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/gallery/image/${encodeURIComponent(fileKey)}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};

export const getGalleryStats = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/gallery/stats`);
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};

// Validate course/product ID
export const validateItemId = async (type, id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/gallery/validate/${type}/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, found: false, message: '0 یافت شد' };
    }
};

// Link image to course or product
export const linkImageToItem = async (imageUrl, type, id) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/gallery/link-image`, {
            imageUrl,
            type,
            id
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: 'خطا در اتصال تصویر' };
    }
};

// Unlink image from course or product
export const unlinkImageFromItem = async (imageUrl, type, id) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/gallery/unlink-image`, {
            imageUrl,
            type,
            id
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: 'خطا در حذف اتصال تصویر' };
    }
};

















export const updateImageMetadata = async (imageKey, imageUrl, data) => {
    try {
        console.log('API call - updateImageMetadata:', { imageKey, imageUrl, data });
        
        const response = await axios.put(
            `${process.env.REACT_APP_BASE_URL}/api/gallery/image/${encodeURIComponent(imageKey)}/metadata`,
            {
                ...data,
                imageUrl: imageUrl
            }
        );
        
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.log('API error:', error.response?.data || error.message);
        return { 
            success: false, 
            message: error.response?.data?.message || 'خطا در به‌روزرسانی اطلاعات تصویر' 
        };
    }
};

// Get image metadata
export const getImageMetadata = async (imageKey) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/gallery/image/${encodeURIComponent(imageKey)}/metadata`);
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: 'خطا در دریافت اطلاعات تصویر' };
    }
};












// Toggle like/unlike image
export const toggleLikeImage = async (imageKey, imageUrl) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/gallery/toggle-like`, {
            imageKey,
            imageUrl
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: 'خطا در تغییر وضعیت لایک' };
    }
};

// Get liked images
export const getLikedImages = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/gallery/liked`);
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
};