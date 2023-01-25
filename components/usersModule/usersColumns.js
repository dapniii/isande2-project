import React from "react";
import { Text, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import GlobalFilter from "../table/globalFilter";

export const COLUMNS = [
    {
      Header: "",
      id: "index",
      accessor: (/** @type {any} */ _row, /** @type {number} */ i) => i + 1,
      Cell: (props) => {
        return (
          <>
            <Text fontWeight={"bold"} float={"left"}>
              {props.value}
            </Text>
          </>
        )
      },
      width: 10,
    },
    {
      Header: "",
      id: "photo",
      accessor: "photo",
      Cell: (props) => {
        return (
          <>
            <Image src={props.row.original.photo} 
              alt={props.row.original.name} 
              borderRadius={"full"}
              border={"2px solid #9F9F9F"}
            />
          </>
        )
      },
      width: 90,
    },
    {
        Header: "Name",
        id: "name",
        accessor: "name",
    },
    {
        Header: "Email",
        id: "email",
        accessor: "email",
    },
    {
        Header: "Phone Number",
        id: "phoneNumber",
        accessor: "phoneNumber",
    },
    {
        Header: "Department",
        id: "department",
        accessor: "department",
    },
    {
        Header: "Role",
        id: "role",
        accessor: "role",
    },
    // {
    //     Header: "User Type",
    //     id: "userType",
    //     accessor: "userType",
    // },
    // {
    //     Header: "Specialty (if Mechanic)",
    //     id: "specialty",
    //     accessor: "specialty",
    // },
];