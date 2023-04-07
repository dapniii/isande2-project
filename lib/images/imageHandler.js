import { imageAPI } from "../routes";
import { cloudinary_config } from "./cloudinary";
import {CloudinaryImage} from "@cloudinary/url-gen";
import {URLConfig} from "@cloudinary/url-gen";
import {CloudConfig} from "@cloudinary/url-gen";
import { nanoid } from "nanoid";

async function getSignature(paramsToSign) {
    const response = await fetch(imageAPI.sign_upload_url, {
        method: 'POST',
        body: JSON.stringify(paramsToSign),
    });
    const data = await response.json();
    const { signature } = data;
    return { signature };
}

// TODO: Make sure that images aren't public 🤡
export const fetchImage = (params) => {
    const cld = new CloudConfig({
        cloudName: cloudinary_config.cloud_name,
        apiKey: cloudinary_config.api_key,
        apiSecret: cloudinary_config.api_secret,
    })
    const url = new URLConfig({secure: true})

    let result = new CloudinaryImage(params, cld, url).setDeliveryType('fetch')

    return result;
}

export const uploadImage = async (config) => {
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

    let result = await fetch(imageAPI.cloudinary_upload_url, {
        method: 'POST',
        body: formData
    })
    
    return await result.json()
}

export const uploadPoFile = async (file, config) => {

    let formData = new FormData();

    // Add timestamp
    let timestamp = Math.round(new Date() /1000);

    // Sign upload params
    let paramsToSign = {
        timestamp: timestamp,
        folder: "poFiles",
        // type: "private",
    };
    const { signature } = await getSignature(paramsToSign);

    // Append signed params to form
    for (const [key, value] of Object.entries(paramsToSign)) {
        formData.append(key, value);

        // No signature needed
        formData.append('file', file);
        formData.append("resource_type", "raw");
        formData.append("api_key", cloudinary_config.api_key);
        formData.append("signature", signature);
    }

    let result = await fetch(imageAPI.cloudinary_upload_url, {
        method: 'POST',
        body: formData
    })




    return await result.json()

}



