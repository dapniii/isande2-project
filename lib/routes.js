
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
    edit_user: `/api/users/edit`
}

export const sparePartsAPI = {
    get_all_parts: `http://localhost:3000/api/spareparts/getAll`,
    get_categories: `http://localhost:3000/api/spareparts/getCategories`,
    modify_category: `/api/spareparts/categories/modify`,
    modify_brand: `/api/spareparts/brands/modify`,
    modify_measure: `api/measures/modify`,
    create_part: `/api/spareparts/create`,
    edit_part: `/api/spareparts/edit`,
    create_adjustment_record: `/api/spareparts/adjustment/createrecord`,
    modify_reason: `/api/spareparts/adjustment/createreason`
}

export const vehicleAPI = {
    get_categories: `http://localhost:3000/api/vehicles/getCategories`
}
