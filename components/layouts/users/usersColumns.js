import React from "react";
import { Text, Flex, Grid, GridItem, Image, Button, Link, Avatar } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import GlobalFilter from "@/components/table/globalFilter";

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
    //   accessor: "imageID.secure_url",
    //   Cell: (props) => {
    //     return (
    //       <>
    //         <Image src={props.row.original.imageID.secure_url} 
    //           alt={props.row.original.firstName} 
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
            <Avatar src={props.row.original.imageID.secure_url} 
              name={props.row.original.firstName + " " + props.row.original.lastName}
              size={"lg"} 
              border={"2px solid #9F9F9F"}
            />
            <Flex flexDirection={"column"} ml={"2em"}>
              <Text fontWeight={"semibold"}>{props.row.original.firstName + " " + props.row.original.lastName}</Text>
              <Text fontSize={"sm"}>{props.row.original.departmentID.name}</Text>          
            </Flex>
          </Flex>
        )
      },
      width: 200,
    },
    {
      Header: "Last Name",
      id: "lastName",
      accessor: "lastName",
      filter: GlobalFilter,
      width: 100,
    },
    {
      Header: "First Name",
      id: "firstName",
      accessor: "firstName",
      filter: GlobalFilter,
      width: 100,
    },
    {
      Header: "Email",
      id: "email",
      accessor: "email",
      filter: GlobalFilter,
      Cell: (props) => {
        return (
          <Link>{props.row.original.email}</Link>
        )
      },
      width: 250,
    },
    {
      Header: "Phone Number",
      id: "phone",
      accessor: "phone",
    },
    {
      Header: "Department",
      id: "department",
      accessor: "departmentID.name",
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
      accessor: "roleID.name",
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
      },
      Cell: (props) => {
        return (
          <Flex flexDirection={"column"}>
            <Text>{props.row.original.roleID.name}</Text>
            {props.row.original.specialtyID != null ? (<Text fontSize={"sm"} color={"gray"}>{props.row.original.specialtyID.name}</Text>) : (<></>)}
            
          </Flex>
        )
      }
    },
    {
        Header: "User Type",
        id: "userType",
        accessor: "userTypeID.name",
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
        accessor: "specialtyID.name",
    },
];