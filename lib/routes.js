
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
    modify_vehicle_type: `/api/vehicles/vehicletype/modify`,
    modify_brand: `/api/vehicles/brand/modify`,
    modify_transmission: `/api/vehicles/transmission/modify`,
    modify_model: `/api/vehicles/model/modify`,
    modify_engine_type: `/api/vehicles/enginetype/modify`, 
    modify_chassis: `/api/vehicles/chassis/modify`,
    modify_tire_size: `/api/vehicles/tiresize/modify`,
    modify_gps: `/api/vehicles/gps/modify`,
    modify_fuel_sensor: `/api/vehicles/fuelsensor/modify`,
    get_categories: `http://localhost:3000/api/vehicles/getCategories`,
    create_vehicle: `/api/vehicles/create`,
    get_all: `http://localhost:3000/api/vehicles/getAll`,
    edit_vehicle: `/api/vehicles/edit`
}

export const jobOrderAPI = {
    get_form_categories: `http://localhost:3000/api/joborders/getFormCategories`
}