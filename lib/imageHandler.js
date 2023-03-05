import { cloudinary_upload_url, imageApi } from "./routes";
import { cloudinary_config } from "./cloudinary";
import { v2 as cloudinary } from "cloudinary";

async function getSignature(paramsToSign) {
    const response = await fetch(sign_photo_url, {
        method: 'POST',
        body: JSON.stringify(paramsToSign),
    });
    const data = await response.json();
    const { signature } = data;
    return { signature };
}

const fetchImage = (params) => {
    let result = cloudinary.image(
        params.url, {
            type: 'fetch',
            sign_url: true,
            transformation: [
                params.transformations
            ]
        }, 

    )

    return result;
}

const uploadImage = async (config) => {
    let formData = new FormData();
    
    // Add timestamp
    let timestamp = Math.round(new Date() /1000);
    config.params["timestamp"] = timestamp;

    // Sign upload params
    let paramsToSign = config.params;
    const { signature } = await getSignature(paramsToSign);
    
    // Append signed params to form
    for (const [key, value] of Object.entries(paramsToSign)) {
        formData.append(key, value);
    }
    // No signature needed
    formData.append('file', config.file);
    formData.append("api_key", cloudinary_config.api_key);
    formData.append("signature", signature);

    let result = await fetch(imageApi.sign_upload_url, {
        method: 'POST',
        body: formData
    })//.then(async (response) => {
    //     let result = await response.json()
    //     console.log(result)
    //     return result
    // }).catch((error) => {
    //     console.error('Error:', error);
    //     return error
    // });
    
    return await result.json()
}

export default uploadImage;

