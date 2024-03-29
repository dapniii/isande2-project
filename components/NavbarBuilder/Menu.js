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
} from "./menuItem";



//Returns different Navbar menu options depending on role of current user
export function selectMenu(role, userType) {

    if (userType == "Admin")
        return (<>{AdminMenu()}</>) 

    if (role == "Mechanic" && userType == "Manager") // Chief Mechanic
        return (<>{ChiefMechanicMenu()}</>)

    if (role == "Mechanic" && userType == "Employee") // Mechanic
        return (<>{MechanicMenu()}</>)

    if (role == "Inventory")
        return (<>{InventoryMenu()}</>)

    if (role == "Operations")
        return (<>{OperationsManagerMenu()}</>) 

    if (role == "Purchasing")
        return (<>{PurchasingMenu()}</>) 

    if (role == "Inventory") 
        return (<>{InventoryMenu()}</>)
    
    if (role == "Fuel")
        return(<>{FuelEmployeeMenu()}</>)

    return (<>{AdminMenu()}</>)
}

//NAVBAR MENU OPTIONS
function AdminMenu() {
    return (
        <>
            <Dashboard />
            <Users />
            <Vehicles />
            <SpareParts />
            <Fuel />
            <JobOrders />
            <PurchaseOrders />
            <Reports />
        </>
    )
}

function OperationsManagerMenu() {
    return (
        <>
            <Dashboard />
            <Vehicles />
            <SpareParts />
            <Fuel />
            <JobOrders />
            <PurchaseOrders />
            <Reports />
        </>
    )
}

function FuelEmployeeMenu() {
    return (
        <>
            <Dashboard />
            <Fuel />
        </>
    )
}

function ChiefMechanicMenu() {
    return (
        <>
            <Dashboard />
            <Vehicles />
            <SpareParts />
            <JobOrders />
        </>
    )
}

function MechanicMenu() {
    return (
        <>
            <Dashboard />
            <Vehicles />
            <JobOrders />
        </>
    )
}

function InventoryMenu() {
    return (
        <>
            <Dashboard />
            <SpareParts />
            <JobOrders />
            <PurchaseOrders />
        </>
    )
}

function PurchasingMenu() {
    return (
        <>
            <Dashboard />
            <PurchaseOrders />
            <Reports />
        </>
    )
}
