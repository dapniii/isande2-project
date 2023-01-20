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

//Returns different Navbar menu options depending on role of current user
export function selectMenu(role) {
    switch(role) {
        case "Admin": 
            return (<>{AdminMenu}</>)
        default: 
            return (<></>)
    }
}

//NAVBAR MENU OPTIONS
const AdminMenu = (
    <>
        {Dashboard}
        {Users}
        {Vehicles}
        {SpareParts}
        {Fuel}
        {JobOrders}
        {PurchaseOrders}
        {Reminders}
        {Reports}
    </>
)
