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

export const Users = (
    <>{generateMenuItem(MdPerson, "Users", "/users")}</> 
)

export const Dashboard = (
    <>{generateMenuItem(MdDashboard, "Dashboard", "/")}</> 
)

export const Vehicles = (
    <>{generateMenuItem(FaTruck, "Vehicles", "/vehicles")}</> 
)

export const SpareParts = (
    <>{generateMenuItem(FaToolbox, "Spare Parts", "/parts")}</> 
)

export const Fuel = (
    <>{generateMenuItem(FaGasPump, "Fuel", "/fuel")}</> 
)

export const JobOrders = (
    <>{generateMenuItem(FaWrench, "Job Orders", "/job-orders")}</> 
)

export const PurchaseOrders = (
    <>{generateMenuItem(MdStorefront, "Purchase Orders", "/purchase-orders")}</> 
)

export const Reminders = (
    <>{generateMenuItem(MdNotifications, "Reminders", "/reminders")}</> 
)

export const Reports = (
    <>{generateMenuItem(FaFileAlt, "Reports", "/reports")}</> 
)

//Takes in Menu item icon, name, and path to generate its coresponding NavBar button
function generateMenuItem(icon, name, path) {
    //Format menu item look
    let menuItem = (
        <Icon as={icon} 
            boxSize={6}  
            color={"currentcolor"}
        />
    ) ;

    // Centralized design, no need for special User effect - Spencer
    // if (name == "Users") {
    //     menuItem = (
    //         <Icon as={icon} 
    //             boxSize={6}
    //             borderRadius={"10%"}   
    //             bg={"white"}
    //             color={"#222222"}
    //         />
    //     ) 
    // }  
    // else {
    //     menuItem = (
    //         <Icon as={icon} 
    //             boxSize={6}  
    //             color={"currentcolor"}
    //         />
    //     ) 
    // }

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
                    {menuItem}
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
  