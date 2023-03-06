
export const imageAPI = {
    sign_upload_url: `/api/photo/sign`,
    cloudinary_upload_url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`,
};

export const userAPI = {
    get_all_users: `http://localhost:3000/api/users/getAll`,
    get_categories: `http://localhost:3000/api/users/getCategories`,
    modify_department: `/api/users/departments/modify`,
    modify_role: `/api/users/roles/modify`,
    modify_specialties: `/api/users/specialties/modify`,
    modify_user_type: `/api/users/userTypes/modify`,
    create_user: `/api/users/create`,
}

export const sparePartsAPI = {
    modify_category: `/api/parts/categories/modify`,
    modify_brand: `/api/parts/brands/modify`,
    create_part: `/api/parts/create`
}
