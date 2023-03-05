export const cloudinary_upload_url = 
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;

export const imageApi = {
    sign_upload_url: `/api/photo/sign`,
};

export const userApi = {
    get_categories: `http://localhost:3000/api/users/getCategories`,
    create_department: `/api/users/departments/modify`,
    create_role: `/api/users/roles/modify`,
    create_specialties: `/api/users/specialties/modify`,
    create_user_type: `/api/users/userTypes/modify`,
}
