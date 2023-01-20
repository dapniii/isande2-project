import * as React from 'react';
import { 
    Users, 
    Dashboard, 
    Vehicles, 
    SpareParts, 
    Fuel, 
    JobOrders, 
    PurchaseOrders, 
    Reminders, 
    Reports
} from "./MenuItem";

export function selectMenu(role) {
    switch(role) {
        case "Admin": 
            return (<>{AdminMenu}</>)
        default: 
            return (<></>)
    }
}

const AdminMenu = (
    <>
        {Users}
        {Dashboard}
        {Vehicles}
        {SpareParts}
        {Fuel}
        {JobOrders}
        {PurchaseOrders}
        {Reminders}
        {Reports}
    </>
)
