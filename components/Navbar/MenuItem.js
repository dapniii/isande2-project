import * as React from 'react';
import { 
    MdPerson, 
    MdDashboard,
    MdStorefront,
    MdNotifications,
} from "react-icons/md";
import {
    FaTruck,
    FaToolbox,
    FaGasPump,
    FaWrench,
    FaFileAlt,
} from "react-icons/fa";
import { Flex, Text, Icon, Box } from "@chakra-ui/react";
import Link from "next/link";

export function Users() {
    return <>{generateMenuItem(MdPerson, "Users", "/users")}</>
}
    
export function Dashboard() {
    return <>{generateMenuItem(MdDashboard, "Dashboard", "/")}</>
}

export function Vehicles() {
    return <>{generateMenuItem(FaTruck, "Vehicles", "/vehicles") }</>
}

export function SpareParts() {
    return <>{generateMenuItem(FaToolbox, "Spare Parts", "/parts")}</>
}

export function Fuel() {
    return <>{generateMenuItem(FaGasPump, "Fuel", "/fuel")}</>
}

export function JobOrders() {
    return <>{generateMenuItem(FaWrench, "Job Orders", "/joborders")}</>
}

export function PurchaseOrders() {
    return <>{generateMenuItem(MdStorefront, "Purchase Orders", "/purchaseorders")}</>
}

export function Reminders() {
    return <>{generateMenuItem(MdNotifications, "Reminders", "/reminders")}</>
}

export function Reports() {
    return <>{generateMenuItem(FaFileAlt, "Reports", "/reports")}</>
}

//Takes in Menu item icon, name, and path to generate its coresponding NavBar button
function generateMenuItem(icon, name, path) {
    return (
        <>
        {/* Parent Container which contains Menu item path when clicked */}
            <Link href={path} passHref legacyBehavior>
                <Flex 
                    w="100%" 
                    h={"2.3em"}
                    px={5}
                    alignItems="center" 
                    gap={3} 
                    cursor={"pointer"} 
                    bg="#222222"
                    color="white"
                    transitionDuration="180ms"
                    _hover={{
                        bg: "white",
                        color: "#222222",
                        transitionDuration: "480ms",
                    }}
                
                >
                {/* Menu Item Icon */}
                    <Icon as={icon} 
                        boxSize={6}  
                        color={"currentcolor"}
                    />
                {/* Menu Item Name */}
                    <Text 
                        fontWeight="semibold" 
                        color={"currentcolor"}
                    >
                        {name}
                    </Text>
                </Flex>
            </Link>
        </>
    );
}
  