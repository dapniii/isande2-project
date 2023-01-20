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

function generateMenuItem(icon, name, path) {
    let menuItem;

    if (name == "Users") {
        menuItem = (
            <Icon as={icon} 
                boxSize={6}
                borderRadius={"10%"}   
                bg={"white"}
                color={"#222222"}
            />
        ) 
    }  
    else {
        menuItem = (
            <Icon as={icon} 
                boxSize={6}  
                color={"currentcolor"}
            />
        ) 
    }

    return (
        <>
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
                    _hover={{
                        bg: "white",
                        color: "black",
                    }}
                
                >
                
                    {menuItem}
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
  