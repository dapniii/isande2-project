import { cloudinary_upload_url, sign_photo_url } from "./routes";
import { cloudinary_config } from "./cloudinary";

async function getSignature(paramsToSign) {
    const response = await fetch(sign_photo_url, {
        method: 'POST',
        body: JSON.stringify(paramsToSign),
    });
    const data = await response.json();
    const { signature } = data;
    return { signature };
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

    fetch(cloudinary_upload_url, {
        method: 'POST',
        body: formData
    }).then((response) => response.json())
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export default uploadImage;

