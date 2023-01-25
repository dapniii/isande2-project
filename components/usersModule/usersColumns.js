import React from "react";
import { Text, Flex, Grid, GridItem, Image, Button } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import GlobalFilter from "../table/globalFilter";

export const COLUMNS = [
    // {
    //   Header: "",
    //   id: "index",
    //   accessor: (/** @type {any} */ _row, /** @type {number} */ i) => i + 1,
    //   Cell: (props) => {
    //     return (
    //       <>
    //         <Text fontWeight={"bold"} float={"left"}>
    //           {props.value}
    //         </Text>
    //       </>
    //     )
    //   },
    //   width: 10,
    // },
    // {
    //   Header: "",
    //   id: "photo",
    //   accessor: "photo",
    //   Cell: (props) => {
    //     return (
    //       <>
    //         <Image src={props.row.original.photo} 
    //           alt={props.row.original.name} 
    //           borderRadius={"full"}
    //           border={"2px solid #9F9F9F"}
    //         />
    //       </>
    //     )
    //   },
    //   width: 90,
    // },
    {
      Header: () => {
        return (
          <>
            <Flex justifyContent={"center"}>
              Name
            </Flex>
          </>
        )
      },
      id: "tableName",
      accessor: "tableName",
      Cell: (props) => {
        return (
          <Flex alignItems={"center"}>
            <Text fontWeight={"semibold"} mr={"1em"}>{props.row.index + 1}</Text>
            <Image src={props.row.original.photo} 
              alt={props.row.original.name}
              boxSize={"3.5em"} 
              borderRadius={"full"}
              border={"2px solid #9F9F9F"}
            />
            <Flex flexDirection={"column"} ml={"2em"}>
              {/* <Button onClick={() => console.log(props.row)}></Button> */}
              <Text fontWeight={"semibold"}>{props.row.original.name}</Text>
              <Text fontSize={"sm"}>{props.row.original.department}</Text> 
              <Text fontSize={"xs"}>{props.row.original.role} {props.row.original.userType}</Text>         
            </Flex>
          </Flex>
        )
      },
      width: 200,
    },
    {
      Header: "Name",
      id: "name",
      accessor: "name",
      filter: GlobalFilter,
    },
    {
      Header: "Email",
      id: "email",
      accessor: "email",
      filter: GlobalFilter,
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
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
      },
    },
    {
      Header: "Role",
      id: "role",
      accessor: "role",
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
      },
    },
    {
        Header: "User Type",
        id: "userType",
        accessor: "userType",
        filter: (rows, id, filterValue) => {
          return rows.filter(
            (row) =>
              filterValue.length <= 0 ||
              !filterValue ||
              filterValue.includes(row.values[id])
          );
        },
    },
    {
        Header: "Specialty (if Mechanic)",
        id: "specialty",
        accessor: "specialty",
    },
];