import { v2 as cloudinary }  from "cloudinary";
import { cloudinary_config } from "@/lib/images/cloudinary";

const sign = async (req, res) => {
  let paramsToSign = JSON.parse(req.body);
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary_config.api_secret, 
  );
  
  res.statusCode = 200;
  res.json({ signature });
};

export default sign;