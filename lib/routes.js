
export const imageAPI = {
    sign_upload_url: `/api/photo/sign`,
    cloudinary_upload_url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/auto/upload`,

};

export const userAPI = {
    get_all_users: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/getAll`,
    get_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/getCategories`,
    modify_department: `/api/users/departments/modify`,
    modify_role: `/api/users/roles/modify`,
    modify_specialties: `/api/users/specialties/modify`,
    modify_user_type: `/api/users/userTypes/modify`,
    create_user: `/api/users/create`,
    edit_user: `/api/users/edit`,
    disable_user: `/api/users/disable`
}

export const sparePartsAPI = {
    get_all_parts: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spareparts/getAll`,
    get_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spareparts/getCategories`,
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
    get_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicles/getCategories`,
    create_vehicle: `/api/vehicles/create`,
    get_all: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicles/getAll`,
    edit_vehicle: `/api/vehicles/edit`
}

export const jobOrderAPI = {
    get_form_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/joborders/getFormCategories`,
    receive_items: `/api/joborders/transactions/returnItems`
}

export const purchaseOrderAPI = {
    modify_city: `/api/purchaseorders/categories/modifyCity`,
    modify_province: `/api/purchaseorders/categories/modifyProvince`,
    modify_status: `/api/purchaseorders/categories/modifyStatus`,
    get_supplier_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchaseorders/categories/getSupplierCategories`,
    create_supplier: `/api/purchaseorders/categories/createSupplier`,
    get_form_categories: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchaseorders/getFormCategories`,
    create_purchase_order: `/api/purchaseorders/createPurchaseOrder`,
    get_purchase_orders: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/purchaseorders/getPurchaseOrderList`,
    approve: `/api/purchaseorders/transactions/approve`,
    create_comment: `/api/purchaseorders/transactions/createComment`,
    confirm_purchase: `/api/purchaseorders/transactions/confirmPurchase`,
    receive_items: `/api/purchaseorders/transactions/receiveItems`,
}

export const fuelAPI = {
    create_fuelOut: `/api/fuel/fuelOut/create`,
    create_fuelIn: `/api/fuel/fuelIn/create`,
    get_fuelIn: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fuel/fuelIn`,
    get_fuelOut: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fuel/fuelOut`,
}